import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import { AuditLogs } from '/imports/share/collections/audit-logs';
import { Organizations } from '/imports/share/collections/organizations';
import { getUserFullNameOrEmail } from '/imports/share/helpers';
import { DocChangesKinds, SystemName } from '/imports/share/constants';
import { ChangesKinds } from './utils/changes-kinds';
import DocumentDiffer from './utils/document-differ';
import { renderTemplate } from '../helpers/render';
import NotificationsTempStore from './notifications-temp-store';
import { DEFAULT_EMAIL_TEMPLATE } from '../constants';

export default class DocChangeHandler {
  constructor(auditConfig, docChangeKind, docChangeData) {
    this._config = auditConfig;
    this._docChangeKind = docChangeKind;

    const { newDocument, oldDocument, userId } = docChangeData;

    if (docChangeKind === DocChangesKinds.DOC_CREATED) {
      this._newDoc = newDocument;
      this._date = newDocument.createdAt;
      this._userId = userId || newDocument.createdBy;
    } else if (docChangeKind === DocChangesKinds.DOC_UPDATED) {
      this._newDoc = newDocument;
      this._oldDoc = oldDocument;
      this._date = newDocument.updatedAt;
      this._userId = userId || newDocument.updatedBy;
    } else if (docChangeKind === DocChangesKinds.DOC_REMOVED) {
      this._oldDoc = oldDocument;
      this._date = new Date();
      this._userId = userId;
    }
  }

  handleChange() {
    this._prepare();

    this._getHandlers();
    this._processHandlers();

    this._saveLogs();
    this._addNotificationsToTempStore();
  }

  _prepare() {
    if (this._userId === SystemName) {
      this._user = this._userId;
    } else {
      this._user = Meteor.users.findOne({ _id: this._userId });
    }

    const doc = this._newDoc || this._oldDoc;

    this._docId = this._config.docId(doc);
    this._docDesc = this._config.docDescription(doc);
    this._docName = this._config.docName(doc);
    this._docUrl = this._config.docUrl(doc);

    this._userName = getUserFullNameOrEmail(this._user);

    this._docNotifyList = this._config.docNotifyList
      && this._config.docNotifyList(doc);

    this._unsubscribeUrl = this._config.docUnsubscribeUrl
      && this._config.docUnsubscribeUrl(doc);

    this._docOrgId = this._config.docOrgId(doc);
    this._organization = Organizations.findOne({ _id: this._docOrgId }) || {};

    this._collectionName = this._config.collectionName;

    this._handlersToProcess = [];
    this._logs = [];
    this._notifications = [];
  }

  _getHandlers() {
    switch (this._docChangeKind) {
      case DocChangesKinds.DOC_CREATED:
        this._getHandlersForCreateAction();
        break;
      case DocChangesKinds.DOC_UPDATED:
        this._getHandlersForUpdateAction();
        break;
      case DocChangesKinds.DOC_REMOVED:
        this._getHandlersForRemoveAction();
        break;
      default:
        break;
    }
  }

  _getHandlersForCreateAction() {
    this._handlersToProcess.push({
      handler: this._config.onCreated,
      args: {
        newDoc: this._newDoc,
        user: this._user,
        date: this._date,
        organization: this._organization,
        auditConfig: this._config,
      },
    });
  }

  _getHandlersForUpdateAction() {
    const diffs = DocumentDiffer.getDiff(this._newDoc, this._oldDoc) || [];

    const diffsMap = {};
    diffs.forEach(({ field, ...rest }) => {
      diffsMap[field] = { field, ...rest };
    });

    const args = {
      diffs: diffsMap,
      newDoc: this._newDoc,
      oldDoc: this._oldDoc,
      user: this._user,
      date: this._date,
      organization: this._organization,
      auditConfig: this._config,
    };

    diffs.forEach((diff) => {
      const handler = this._config.updateHandlers.find(hdl => hdl.field === diff.field);

      if (!handler) {
        return;
      }

      this._handlersToProcess.push({ handler, args });
    });
  }

  _getHandlersForRemoveAction() {
    this._handlersToProcess.push({
      handler: this._config.onRemoved,
      args: {
        oldDoc: this._oldDoc,
        user: this._user,
        date: this._date,
        organization: this._organization,
        auditConfig: this._config,
      },
    });
  }

  _processHandlers() {
    this._handlersToProcess.forEach(({ handler, args }) => {
      this._processHandler(handler, args);
    });
  }

  _processHandler(handler, args) {
    this._createLogs(handler, args);
    this._createNotifications(handler, args);
    this._callTrigger(handler, args);
  }

  _getDefaultData() {
    return {
      docDesc: this._docDesc,
      docName: this._docName,
      userName: this._userName,
    };
  }

  _createLogs(handler, args) {
    handler.logs.forEach((logConfig) => {
      const { shouldCreateLog } = logConfig;
      if (shouldCreateLog && !shouldCreateLog(args)) {
        return;
      }

      const { diffs = {} } = args;
      const diff = diffs[handler.field];

      this._buildLogs(handler, args, logConfig, diff);
    });
  }

  _buildLogs(handler, args, logConfig, diff) {
    const getData = logConfig.data || handler.data;
    const { message, logData: getLogData } = logConfig;
    const { kind } = diff || {};

    const msgTemplate = _.isObject(message) ? message[kind] : message;
    if (!msgTemplate) {
      return;
    }

    let logData;
    if (getLogData) {
      logData = getLogData(args);
      logData = _.isArray(logData) ? logData : [logData];
    }

    let data = getData && getData(args);
    data = _.isArray(data) ? data : [data];

    const defaultData = this._getDefaultData();

    data.forEach((dataObj, index) => {
      const logDataObj = logData && logData[index];
      const msgTemplateData = Object.assign({}, defaultData, dataObj);

      this._buildLog(msgTemplate, msgTemplateData, diff, logDataObj);
    });
  }

  _buildLog(msgTemplate, msgTemplateData, diff, logData) {
    const message = renderTemplate(msgTemplate, msgTemplateData);

    const collection = this._collectionName;
    const documentId = this._docId;

    const log = {
      organizationId: this._docOrgId,
      date: this._date,
      executor: this._userId,
      collection,
      documentId,
      message,
    };

    const {
      kind, field, newValue, oldValue,
    } = diff || {};
    if (field) {
      Object.assign(log, { field });
    }

    const fieldChanges = [
      ChangesKinds.FIELD_ADDED,
      ChangesKinds.FIELD_CHANGED,
      ChangesKinds.FIELD_REMOVED,
    ];

    if (fieldChanges.indexOf(kind) > -1) {
      Object.assign(log, { newValue, oldValue });
    }

    if (logData) {
      Object.assign(log, logData);

      if (log.documentId !== documentId) {
        ['field', 'newValue', 'oldValue'].forEach(key => delete log[key]);
      }
    }

    this._logs.push(log);
  }

  _createNotifications(handler, args) {
    _(handler.notifications).each((notificationConfig) => {
      const { shouldSendNotification } = notificationConfig;
      if (shouldSendNotification && !shouldSendNotification(args)) {
        return;
      }

      const { diffs = {} } = args;
      const diff = diffs[handler.field];

      this._buildNotifications(handler, args, notificationConfig, diff);
    });
  }

  _buildNotifications(handler, args, notificationConfig, diff) {
    const getData = notificationConfig.data || handler.data;
    const getReceivers = notificationConfig.receivers || handler.receivers;
    const { kind } = diff || {};

    const {
      text, title, emailTemplateName,
      emailText, emailSubject, emailTemplateData: getEmailTplData,
      pushText, pushTitle, pushData: getPushData,
      sendBoth = false,
    } = notificationConfig;

    let emailTemplate = emailText || text;
    let pushTemplate = pushText || text;

    emailTemplate = _.isObject(emailTemplate) ? emailTemplate[kind] : emailTemplate;
    pushTemplate = _.isObject(pushTemplate) ? pushTemplate[kind] : pushTemplate;

    if (!emailTemplate && !pushTemplate) {
      return;
    }

    let emailSubjectTemplate = emailSubject || title;
    let pushTitleTemplate = pushTitle || title;

    emailSubjectTemplate = _.isObject(emailSubjectTemplate)
      ? emailSubjectTemplate[kind]
      : emailSubjectTemplate;

    pushTitleTemplate = _.isObject(pushTitleTemplate)
      ? pushTitleTemplate[kind]
      : pushTitleTemplate;

    let data = getData && getData(args);
    data = _.isArray(data) ? data : [data];

    let receiversArr = _.isFunction(getReceivers) && getReceivers(args) || [];
    receiversArr = _.isArray(receiversArr[0]) ? receiversArr : [receiversArr];

    let emailTplDataArr;
    if (getEmailTplData) {
      emailTplDataArr = getEmailTplData(args);
      emailTplDataArr = _.isArray(emailTplDataArr) ? emailTplDataArr : [emailTplDataArr];
    }

    let pushDataArr;
    if (getPushData) {
      pushDataArr = getPushData(args);
      pushDataArr = _.isArray(pushDataArr) ? pushDataArr : [pushDataArr];
    }

    const defaultData = this._getDefaultData();

    data.forEach((dataObj, index) => {
      const emailTemplateData = emailTplDataArr && emailTplDataArr[index];
      const pushData = pushDataArr && pushDataArr[index];
      const receivers = receiversArr[index];
      const templateData = Object.assign({}, defaultData, dataObj);

      this._buildNotification({
        emailTemplate,
        emailSubjectTemplate,
        emailTemplateData,
        pushTemplate,
        pushTitleTemplate,
        pushData,
        emailTemplateName,
        receivers,
        templateData,
        sendBoth,
      });
    });
  }

  _buildNotification({
    emailTemplate, emailSubjectTemplate, emailTemplateData,
    pushTemplate, pushTitleTemplate, pushData,
    emailTemplateName, receivers, templateData,
    sendBoth,
  }) {
    if (!receivers || !receivers.length) {
      return;
    }

    const emailText = renderTemplate(emailTemplate, templateData);
    const pushText = renderTemplate(pushTemplate, templateData);

    let emailSubject;
    if (emailSubjectTemplate) {
      emailSubject = renderTemplate(emailSubjectTemplate, templateData);
    } else {
      emailSubject = this._getDefaultNotificationTitle();
    }

    let pushTitle;
    if (pushTitleTemplate) {
      pushTitle = renderTemplate(pushTitleTemplate, templateData);
    } else {
      pushTitle = this._getDefaultNotificationTitle();
    }

    const notification = {
      recipients: receivers,
      templateName: emailTemplateName || DEFAULT_EMAIL_TEMPLATE,
      emailSubject,

      templateData: Object.assign({
        organizationName: this._organization.name,
        docName: this._docName,
        title: emailSubject,
        text: emailText,
      }, emailTemplateData),

      notificationData: Object.assign({
        title: pushTitle,
        body: pushText,
        url: this._docUrl,
      }, pushData),

      sendBoth,
    };

    if (_.isObject(this._user)) {
      Object.assign(notification.templateData, {
        avatar: { url: this._user.profile.avatar },
      });
    }

    if (this._docUrl && !notification.templateData.button) {
      Object.assign(notification.templateData, {
        button: {
          url: this._docUrl,
          label: 'Go to this document',
        },
      });
    }

    if (this._unsubscribeUrl) {
      Object.assign(notification.templateData, {
        unsubscribeUrl: this._unsubscribeUrl,
      });
    }

    this._notifications.push(notification);
  }

  _getDefaultNotificationTitle() {
    const action = {
      [DocChangesKinds.DOC_CREATED]: 'created',
      [DocChangesKinds.DOC_UPDATED]: 'updated',
      [DocChangesKinds.DOC_REMOVED]: 'removed',
    }[this._docChangeKind];

    return `${this._userName} ${action} ${this._docDesc} ${this._docName}`;
  }

  _saveLogs() {
    this._logs.forEach(log => AuditLogs.insert(log));
  }

  _addNotificationsToTempStore() {
    NotificationsTempStore.addNotifications(this._notifications);
  }

  _callTrigger(handler, args) {
    const { trigger } = handler;
    if (_.isFunction(trigger)) {
      trigger(args);
    }
  }
}
