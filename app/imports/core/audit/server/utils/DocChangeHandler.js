import { Meteor } from 'meteor/meteor';

import { AuditLogs } from '/imports/api/audit-logs/audit-logs.js';
import { SystemName } from '/imports/api/constants.js';
import { deepExtend } from '/imports/api/helpers.js';
import { renderTemplate } from './helpers.js';
import { DocChangesKinds, ChangesKinds } from './changes-kinds.js';
import DocumentDiffer from './document-differ.js';
import NotificationSender from '../../../NotificationSender.js';


const DEFAULT_EMAIL_TEMPLATE = 'personalEmail';

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
      this._userId = newDocument.updatedBy;
    } else if (docChangeKind === DocChangesKinds.DOC_REMOVED) {
      this._oldDoc = oldDocument;
      this._date = new Date();
      this._userId = userId;
    }

    if (this._userId === SystemName) {
      this._user = this._userId;
    } else {
      this._user = Meteor.users.findOne({ _id: this._userId });
    }

    const doc = newDocument || oldDocument;

    this._docId = auditConfig.docId(doc);
    this._docDesc = auditConfig.docDescription(doc);
    this._docUrl = auditConfig.docUrl(doc);

    this._docOrgId = auditConfig.docOrgId(doc);

    const { name:orgName } = Organizations.findOne({ _id: this._docOrgId }) || {};
    this._docOrgName = orgName;

    this._collectionName = auditConfig.collectionName;

    this._handlersToProcess = [];
    this._logs = [];
    this._notifications = [];
  }

  handleChange() {
    this._getHandlers();
    this._processHandlers();

    this._saveLogs();
    this._sendNotifications();

    this._reset();
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
    }
  }

  _getHandlersForCreateAction() {
    this._handlersToProcess.push({
      handler: this._config.onCreated,
      args: {
        newDoc: this._newDoc,
        user: this._user,
        date: this._date
      }
    });
  }

  _getHandlersForUpdateAction() {
    const diffs = DocumentDiffer.getDiff(this._newDoc, this._oldDoc);

    const diffsMap = {};
    _(diffs).each(({ field, ...rest }) => {
      diffsMap[field] = { field, ...rest };
    });

    const args = {
      diffs: diffsMap,
      newDoc: this._newDoc,
      oldDoc: this._oldDoc,
      user: this._user,
      date: this._date
    };

    _(diffs).each((diff) => {
      const handler = this._config.updateHandlers.find(
        hdl => hdl.field === diff.field
      );

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
        date: this._date
      }
    });
  }

  _processHandlers() {
    _(this._handlersToProcess).each(({ handler, args }) => {
      this._processHandler(handler, args);
    });
  }

  _processHandler(handler, args) {
    this._createLogs(handler, args);
    this._createNotifications(handler, args);
  }

  _createLogs(handler, args) {
    _(handler.logs).each((logConfig) => {
      const { shouldCreateLog } = logConfig;
      if (shouldCreateLog && !shouldCreateLog.call(this._config, args)) {
        return;
      }

      const { diffs = {} } = args;
      const diff = diffs[handler.field];

      this._buildLogs(handler, args, logConfig, diff);
    });
  }

  _buildLogs(handler, args, logConfig, diff) {
    const getData = logConfig.data || handler.data;
    const { message, logData:getLogData } = logConfig;
    const { kind } = diff || {};

    const msgTemplate = _(message).isObject() ? message[kind] : message;
    if (!msgTemplate) {
      return;
    }

    let logData;
    if (getLogData) {
      logData = getLogData.call(this._config, args);
      logData = _(logData).isArray() ? logData : [logData];
    }

    let data = getData && getData.call(this._config, args);
    data = _(data).isArray() ? data : [data];

    _(data).each((templateData, index) => {
      const logDataObj = logData && logData[index];

      this._buildLog(msgTemplate, templateData, diff, logDataObj);
    });
  }

  _buildLog(msgTemplate, templateData, diff, logData) {
    const message = renderTemplate(msgTemplate, templateData);

    const collection = this._collectionName;
    const documentId = this._docId;

    const log = {
      date: this._date,
      executor: this._userId,
      collection,
      documentId,
      message
    };

    const { kind, field, newValue, oldValue } = diff || {};

    field && _(log).extend({ field });

    const fieldChanges = [
      ChangesKinds.FIELD_ADDED,
      ChangesKinds.FIELD_CHANGED,
      ChangesKinds.FIELD_REMOVED
    ];
    if (_(fieldChanges).contains(kind)) {
      _(log).extend({ newValue, oldValue });
    }

    if (logData) {
      _(log).extend(logData);

      if (log.documentId !== documentId) {
        _(['field', 'newValue', 'oldValue']).each(key => delete log[key]);
      }
    }

    this._logs.push(log);
  }

  _createNotifications(handler, args) {
    _(handler.notifications).each((notificationConfig) => {
      const { shouldSendNotification } = notificationConfig;
      if (shouldSendNotification && !shouldSendNotification.call(this._config, args)) {
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
      emailText, emailSubject, emailTemplateData:getEmailTplData,
      pushText, pushTitle, pushData:getPushData,
      sendBoth=false
    } = notificationConfig;

    let emailTemplate = emailText || text;
    let pushTemplate = pushText || text;

    emailTemplate = _(emailTemplate).isObject() ? emailTemplate[kind] : emailTemplate;
    pushTemplate = _(pushTemplate).isObject() ? pushTemplate[kind] : pushTemplate;

    if (!emailTemplate && !pushTemplate) {
      return;
    }

    let emailSubjectTemplate = emailSubject || title;
    let pushTitleTemplate = pushTitle || title;

    emailSubjectTemplate = _(emailSubjectTemplate).isObject()
        ? emailSubjectTemplate[kind]
        : emailSubjectTemplate;

    pushTitleTemplate = _(pushTitleTemplate).isObject()
        ? pushTitleTemplate[kind]
        : pushTitleTemplate;

    let data = getData && getData.call(this._config, args);
    data = _(data).isArray() ? data : [data];

    let receiversArr = getReceivers.call(this._config, args) || [];
    receiversArr = _(receiversArr[0]).isArray() ? receiversArr : [receiversArr];

    let emailTplDataArr;
    if (getEmailTplData) {
      emailTplDataArr = getEmailTplData.call(this._config, args);
      emailTplDataArr = _(emailTplDataArr).isArray() ? emailTplDataArr : [emailTplDataArr];
    }

    let pushDataArr;
    if (getPushData) {
      pushDataArr = getPushData.call(this._config, args);
      pushDataArr = _(pushDataArr).isArray() ? pushDataArr : [pushDataArr];
    }

    _(data).each((templateData, index) => {
      const emailTemplateData = emailTplDataArr && emailTplDataArr[index];
      const pushData = pushDataArr && pushDataArr[index];
      const receivers = receiversArr[index];

      this._buildNotification({
        emailTemplate, emailSubjectTemplate, emailTemplateData,
        pushTemplate, pushTitleTemplate, pushData,
        emailTemplateName, receivers, templateData,
        sendBoth
      });
    });
  }

  _buildNotification({
    emailTemplate, emailSubjectTemplate, emailTemplateData,
    pushTemplate, pushTitleTemplate, pushData,
    emailTemplateName, receivers, templateData,
    sendBoth
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
      templateData: _({
        organizationName: this._docOrgName,
        title: emailText
      }).extend(emailTemplateData),
      notificationData: _({
        title: pushTitle,
        body: pushText,
        url: this._docUrl
      }).extend(pushData),
      sendBoth
    };

    if (_(this._user).isObject()) {
      _(notification.templateData).extend({
        avatar: { url: this._user.profile.avatar }
      });
    }

    this._notifications.push(notification);
  }

  _getDefaultNotificationTitle() {
    const user = this._user;
    const action = {
      [DocChangesKinds.DOC_CREATED]: 'created',
      [DocChangesKinds.DOC_UPDATED]: 'updated',
      [DocChangesKinds.DOC_REMOVED]: 'removed'
    }[this._docChangeKind];
    const userName = _(user).isObject() ? user.fullNameOrEmail() : user;
    const docDesc = this._docDesc;

    return `${userName} ${action} ${docDesc}`;
  }

  _saveLogs() {
    _(this._logs).each(log => AuditLogs.insert(log));
  }

  _sendNotifications() {
    const notificationsMap = {};

    _(this._notifications).each((notification) => {
      _(notification.recipients).each((receiverId) => {
        const userNotifications = notificationsMap[receiverId];

        if (_(userNotifications).isArray()) {
          userNotifications.push(notification);
        } else {
          notificationsMap[receiverId] = [notification];
        }
      });
    });

    const receiversCursor = Meteor.users.find({
      _id: { $in: _(notificationsMap).keys() }
    });

    receiversCursor.forEach((user) => {
      this._sendNotificationsToUser(notificationsMap[user._id], user);
    });
  }

  _sendNotificationsToUser(notifications, user) {
    const isUserOnline = user.status === 'online';

    _(notifications).each(({ recipients, sendBoth, ...args }) => {
      const sender = new NotificationSender({
        recipients: user._id,
        ...args
      });

      if (sendBoth) {
        sender.sendAll();
      } else {
        isUserOnline ? sender.sendOnSite() : sender.sendEmail();
      }
    });
  }

  _reset() {
    this._handlersToProcess = [];
    this._logs = [];
    this._notifications = [];
  }

}
