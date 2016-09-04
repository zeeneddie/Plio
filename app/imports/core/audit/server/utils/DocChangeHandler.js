import { AuditLogs } from '/imports/api/audit-logs/audit-logs.js';
import { renderTemplate } from '/imports/api/helpers.js';
import { DocChangesKinds, ChangesKinds } from './changes-kinds.js';
import DocumentDiffer from './document-differ.js';
import NotificationSender from '../../../NotificationSender.js';


export default class DocChangeHandler {

  constructor(auditConfig, docChangeType, docChangeData) {
    this._config = auditConfig;
    this._docChangeType = docChangeType;

    const { newDocument, oldDocument, userId } = docChangeData;

    if (docChangeType === DocChangesKinds.DOC_CREATED) {
      this._newDoc = newDocument;
      this._date = newDocument.createdAt;
      this._executor = userId;
    } else if (docChangeType === DocChangesKinds.DOC_UPDATED) {
      this._newDoc = newDocument;
      this._oldDoc = oldDocument
      this._date = newDocument.updatedAt;
      this._executor = newDocument.updatedBy;
    } else if (docChangeType === DocChangesKinds.DOC_REMOVED) {
      this._oldDoc = oldDocument;
      this._date = new Date();
      this._executor = userId;
    }

    this._documentId = auditConfig.docId(newDocument || oldDocument);
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
    switch (this._docChangeType) {
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
        userId: this._executor
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
      oldDoc: this._oldDoc
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
        userId: this._executor
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
    const documentId = this._documentId;

    const log = {
      date: this._date,
      executor: this._executor,
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

      if ((log.collection !== collection) || (log.documentId !== documentId)) {
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
      template, templateData, receivers,
      subjectTemplate, subjectTemplateData, emailTemplateData
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

    let emailTplDataArr;
    if (emailTemplateData) {
      emailTplDataArr = emailTemplateData.call(this._config, data);
      emailTplDataArr = _(emailTplDataArr).isArray() ? emailTplDataArr : [emailTplDataArr];
    }

    _(tplDataArr).each((tplData, index) => {
      const subject = subjects && subjects[index];
      const emailTplDataObj = emailTplDataArr && emailTplDataArr[index];
      const receivers = notificationReceiversArr[index];

      this._buildNotification(
        notificationTemplate, tplData, subject, emailTplDataObj, receivers
      );
    });
  }

  _buildNotification(template, tplData, subject, emailTplData, receivers) {
    const text = renderTemplate(template, tplData);

    const notification = { receivers, text };

    subject && _(notification).extend({ subject });
    emailTplData && _(notification).extend({ emailTplData });

    this._notifications.push(notification);
  }

  _saveLogs() {
    console.log(this._logs);
    console.log('\n');

    _(this._logs).each(log => AuditLogs.insert(log));
  }

  _sendNotifications() {
    console.log(this._notifications);
    console.log('\n');

    const orgId = this._config.docOrgId(this._newDoc || this._oldDoc);
    const { name:orgName } = Organizations.findOne({ _id: orgId });

    const { profile: { avatar } } = Meteor.users.findOne({ _id: this._executor });

    const templateName = 'minimalisticEmail';

    _(this._notifications).each((notification) => {
      this._sendNotification(notification, {
        templateName, orgName, avatar
      });
    });
  }

  _sendNotification(notification, { templateName, orgName, avatar }) {
    if (!notification.receivers.length) {
      return;
    }

    const docDesc = this._config.docDescription(this._newDoc || this._oldDoc);
    const emailSubject = notification.subject || `${docDesc} updated`;

    const templateData = {
      organizationName: orgName,
      title: emailSubject,
      secondaryText: notification.text,
      avatar: { url: avatar }
    };

    if (notification.emailTplData) {
      _(templateData).extend(notification.emailTplData);
    }

    new NotificationSender({
      recipients: notification.receivers,
      emailSubject,
      templateName,
      templateData,
      notificationData: {
        title: emailSubject,
        body: notification.text
      }
    }).sendOnSite().sendEmail()
  }

  _reset() {
    this._handlersToProcess = [];
    this._logs = [];
    this._notifications = [];
  }

}
