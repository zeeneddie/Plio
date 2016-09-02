import { Meteor } from 'meteor/meteor';

import { AuditLogs } from '/imports/api/audit-logs/audit-logs.js';
import { ChangesKinds, DocumentDiffer, renderString } from './audit-utils.js';


const { FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED, ITEM_ADDED, ITEM_REMOVED } = ChangesKinds;

export default Auditor = {

  _auditConfigs: { },

  documentCreated(newDocument, userId, collection) {
    const config = this._auditConfigs[collection];

    const logs = [];
    const notifications = [];

    const handler = config.onCreated;

    if (!handler) {
      return;
    }

    const data = {
      newDoc: newDocument,
      userId
    };

    this._handleChange(config, handler, data, logs, notifications);

    this._saveLogs(logs);
    this._sendNotifications(notifications);
  },

  documentUpdated(newDocument, oldDocument, collection) {
    const config = this._auditConfigs[collection];
    const diffs = DocumentDiffer.getDiff(newDocument, oldDocument);

    const logs = [];
    const notifications = [];

    const diffsMap = {};
    _(diffs).each(({ field, ...rest }) => {
      diffsMap[field] = { field, ...rest };
    });

    _(diffs).each((diff) => {
      const handler = config.updateHandlers.find(h => h.field === diff.field);
      if (!handler) {
        return;
      }

      const data = {
        diffs: diffsMap,
        newDoc: newDocument,
        oldDoc: oldDocument
      };

      this._handleChange(config, handler, data, logs, notifications);
    });

    this._saveLogs(logs);
    this._sendNotifications(notifications);
  },

  documentRemoved(oldDocument, userId, collection) {
    const config = this._auditConfigs[collection];

    const logs = [];
    const notifications = [];

    const handler = config.onRemoved;

    if (!handler) {
      return;
    }

    const data = {
      oldDoc: oldDocument,
      userId
    };

    this._handleChange(config, handler, data, logs, notifications);

    this._saveLogs(logs);
    this._sendNotifications(notifications);
  },

  registerConfig(config) {
    const collection = config.collection;
    const auditor = this;

    collection.after.insert(function(userId, doc) {
      Meteor.isServer && Meteor.defer(
        () => auditor.documentCreated(doc, userId, collection)
      );
    });

    collection.after.update(function(userId, doc, fieldNames, modifier, options) {
      Meteor.isServer && Meteor.defer(
        () => auditor.documentUpdated(doc, this.previous, collection)
      );
    });

    collection.after.remove(function(userId, doc) {
      Meteor.isServer && Meteor.defer(
        () => auditor.documentRemoved(doc, userId, collection)
      );
    });

    this._auditConfigs[collection] = config;
  },

  _handleChange(config, handler, data, logs, notifications) {
    this._createLogs(config, handler, data, logs);
    this._createNotifications(config, handler, data, notifications);
  },

  _createLogs(config, handler, data, logs) {
    const { diffs = {}, newDoc } = data;
    const { updatedAt:date, updatedBy:executor } = newDoc;
    const { kind, field, newValue, oldValue } = diffs[handler.field] || {};

    _(handler.logs).each((logConfig) => {
      if (logConfig.shouldCreateLog
            && !logConfig.shouldCreateLog.call(config, data)) {
        return;
      }

      const { template, templateData, logData } = logConfig;

      const logTemplate = _(template).isObject() ? template[kind] : template;
      if (!logTemplate) {
        return;
      }

      const documentId = data.documentId || config.docId(newDoc);
      const collection = config.collectionName;

      let logDataArr;
      if (logData) {
        logDataArr = logData.call(config, data);
        logDataArr = _(logDataArr).isArray() ? logDataArr : [logDataArr];
      }

      let tplDataArr = templateData.call(config, data);
      tplDataArr = _(tplDataArr).isArray() ? tplDataArr : [tplDataArr];

      _(tplDataArr).each((tData, i) => {
        const message = renderString(logTemplate, tData);

        const log = { date, executor, field, collection, documentId, message };

        if (_([FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED]).contains(kind)) {
          _(log).extend({ newValue, oldValue });
        }

        if (logDataArr) {
          _(log).extend(logDataArr[i]);

          if ((log.collection !== collection) || (log.documentId !== documentId)) {
            _(['field', 'newValue', 'oldValue']).each(key => delete log[key]);
          }
        }

        logs.push(log);
      });
    });
  },

  _createNotifications(config, handler, data, notifications) {
    const { diffs = {} } = data;
    const { kind } = diffs[handler.field] || {};

    _(handler.notifications).each((notificationConfig) => {
      if (notificationConfig.shouldSendNotification
            && !notificationConfig.shouldSendNotification.call(config, data)) {
        return;
      }

      const {
        template, templateData, receivers,
        subjectTemplate, subjectTemplateData, emailTemplateData
      } = notificationConfig;

      const notificationTemplate = _(template).isObject() ? template[kind] : template;
      if (!notificationTemplate) {
        return;
      }

      let tplDataArr = templateData.call(config, data);
      tplDataArr = _(tplDataArr).isArray() ? tplDataArr : [tplDataArr];

      let subjects;
      if (subjectTemplate && subjectTemplateData) {
        let subjDataArr = subjectTemplateData.call(config, data);
        subjDataArr = _(subjDataArr).isArray() ? subjDataArr : [subjDataArr];

        subjects = _(subjDataArr).map(
          subjData => renderString(subjectTemplate, subjData)
        );
      }

      let emailTplDataArr;
      if (emailTemplateData) {
        emailTplDataArr = emailTemplateData.call(config, data);
        emailTplDataArr = _(emailTplDataArr).isArray() ? emailTplDataArr : [emailTplDataArr];
      }

      _(tplDataArr).each((tData, i) => {
        const text = renderString(notificationTemplate, tData);

        const notificationData = {
          receivers: receivers.call(config, data),
          text
        };

        subjects && _(notificationData).extend({ subject: subjects[i] });

        emailTplDataArr && _(notificationData).extend({
          emailTemplateData: emailTplDataArr[i]
        });

        notifications.push(notificationData);
      });
    });
  },

  _saveLogs(logs) {
    console.log(logs);
    console.log('\n');
    //_(logs).each(log => AuditLogs.insert(log));
  },

  _sendNotifications(notifications) {
    console.log(notifications);
    console.log('\n');
  }

};
