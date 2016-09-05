import { Meteor } from 'meteor/meteor';

import { AuditLogs } from '/imports/api/audit-logs/audit-logs.js';
import { SystemName } from '/imports/api/constants.js';
import { renderTemplate } from '/imports/api/helpers.js';
import { DocChangesKinds, ChangesKinds } from './changes-kinds.js';
import DocumentDiffer from './document-differ.js';
import NotificationSender from '../../../NotificationSender.js';


const DEFAULT_EMAIL_TEMPLATE = 'minimalisticEmail';

export default class DocChangeHandler {

  constructor(auditConfig, docChangeKind, docChangeData) {
    this._config = auditConfig;
    this._docChangeKind = docChangeKind;

    const { newDocument, oldDocument, userId } = docChangeData;

    if (docChangeKind === DocChangesKinds.DOC_CREATED) {
      this._newDoc = newDocument;
      this._date = newDocument.createdAt;
      this._userId = userId;
    } else if (docChangeKind === DocChangesKinds.DOC_UPDATED) {
      this._newDoc = newDocument;
      this._oldDoc = oldDocument
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

    this._docOrgId = auditConfig.docOrgId(doc);

    const { name:orgName } = Organizations.findOne({ _id: this._docOrgId });
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
      data: {
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

    const data = {
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

      this._handlersToProcess.push({ handler, data });
    });
  }

  _getHandlersForRemoveAction() {
    this._handlersToProcess.push({
      handler: this._config.onRemoved,
      data: {
        oldDoc: this._oldDoc,
        user: this._user,
        date: this._date
      }
    });
  }

  _processHandlers() {
    _(this._handlersToProcess).each(({ handler, data }) => {
      this._processHandler(handler, data);
    });
  }

  _processHandler(handler, data) {
    this._createLogs(handler, data);
    this._createNotifications(handler, data);
  }

  _createLogs(handler, data) {
    _(handler.logs).each((logConfig) => {
      if (logConfig.shouldCreateLog
            && !logConfig.shouldCreateLog.call(this._config, data)) {
        return;
      }

      const { diffs = {} } = data;
      const diff = diffs[handler.field];

      this._buildLogs(handler, data, logConfig, diff);
    });
  }

  _buildLogs(handler, data, logConfig, diff) {
    const { template, templateData, logData } = logConfig;
    const { kind } = diff || {};

    const logTemplate = _(template).isObject() ? template[kind] : template;
    if (!logTemplate) {
      return;
    }

    let logDataArr;
    if (logData) {
      logDataArr = logData.call(this._config, data);
      logDataArr = _(logDataArr).isArray() ? logDataArr : [logDataArr];
    }

    let tplDataArr = templateData.call(this._config, data);
    tplDataArr = _(tplDataArr).isArray() ? tplDataArr : [tplDataArr];

    _(tplDataArr).each((tplData, index) => {
      const logDataObj = logDataArr && logDataArr[index];

      this._buildLog(logTemplate, tplData, diff, logDataObj);
    });
  }

  _buildLog(logTemplate, tplData, diff, logData) {
    const message = renderTemplate(logTemplate, tplData);

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

  _createNotifications(handler, data, notificationConfig) {
    _(handler.notifications).each((notificationConfig) => {
      if (notificationConfig.shouldSendNotification
            && !notificationConfig.shouldSendNotification.call(this._config, data)) {
        return;
      }

      const { diffs = {} } = data;
      const diff = diffs[handler.field];

      this._buildNotifications(handler, data, notificationConfig, diff);
    });
  }

  _buildNotifications(handler, data, notificationConfig, diff) {
    const { kind } = diff || {};

    const {
      template, templateData,
      subjectTemplate, subjectTemplateData,
      notificationData, receivers
    } = notificationConfig;

    const notificationTemplate = _(template).isObject() ? template[kind] : template;
    if (!notificationTemplate) {
      return;
    }

    let tplDataArr = templateData.call(this._config, data);
    tplDataArr = _(tplDataArr).isArray() ? tplDataArr : [tplDataArr];

    const notificationReceivers = receivers.call(this._config, data) || [];
    const notificationReceiversArr = _(notificationReceivers[0]).isArray()
        ? notificationReceivers
        : [notificationReceivers]

    let subjects;
    if (subjectTemplate && subjectTemplateData) {
      let subjDataArr = subjectTemplateData.call(this._config, data);
      subjDataArr = _(subjDataArr).isArray() ? subjDataArr : [subjDataArr];

      subjects = _(subjDataArr).map(
        subjData => renderTemplate(subjectTemplate, subjData)
      );
    }

    let notificationDataArr;
    if (notificationData) {
      notificationDataArr = notificationData.call(this._config, data);
      notificationDataArr = _(notificationDataArr).isArray()
          ? notificationDataArr
          : [notificationDataArr];
    }

    _(tplDataArr).each((tplData, index) => {
      const subject = subjects && subjects[index];
      const notificationDataObj = notificationDataArr && notificationDataArr[index];
      const receivers = notificationReceiversArr[index];

      this._buildNotification(
        notificationTemplate, tplData, subject, notificationDataObj, receivers
      );
    });
  }

  _buildNotification(template, tplData, subject, notificationData, receivers) {
    if (!receivers || !receivers.length) {
      return;
    }

    const text = renderTemplate(template, tplData);

    const user = this._user;

    if (!subject) {
      const action = {
        [DocChangesKinds.DOC_CREATED]: 'created',
        [DocChangesKinds.DOC_UPDATED]: 'updated',
        [DocChangesKinds.DOC_REMOVED]: 'removed'
      }[this._docChangeKind];
      const userName = _(user).isObject() ? user.fullNameOrEmail() : user;
      const docDesc = this._docDesc;

      subject = `${userName} ${action} ${docDesc}`;
    }

    const notification = {
      recipients: receivers,
      emailSubject: subject,
      templateName: DEFAULT_EMAIL_TEMPLATE,
      templateData: {
        organizationName: this._docOrgName,
        title: subject,
        secondaryText: text
      },
      notificationData: {
        title: subject,
        body: text
      }
    };

    if (_(user).isObject()) {
      _(notification.templateData).extend({
        avatar: { url: user.profile.avatar }
      });
    }

    notificationData && _(notification).extend(notificationData);

    this._notifications.push(notification);
  }

  _saveLogs() {
    //console.log(this._logs);
    //console.log('\n');

    _(this._logs).each(log => AuditLogs.insert(log));
  }

  _sendNotifications() {
    console.log(this._notifications);
    console.log('\n');

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

    _(notifications).each(({ recipients, ...args }) => {
      const sender = new NotificationSender({
        recipients: user._id,
        ...args
      });

      isUserOnline ? sender.sendOnSite() : sender.sendEmail();
    });
  }

  _reset() {
    this._handlersToProcess = [];
    this._logs = [];
    this._notifications = [];
  }

}
