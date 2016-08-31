import { Meteor } from 'meteor/meteor';
import Handlebars from 'handlebars';

import { AuditLogs } from '/imports/api/audit-logs/audit-logs.js';
import { ChangesKinds, DocumentDiffer } from './document-differ.js';


export default {

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
    const log = this._createLog(config, handler, data);
    const notification = this._createNotification(config, handler, data);

    log && logs.push(log);
    notification && notifications.push(notification);

    const additionalHandlers = handler.additionalHandlers
        && handler.additionalHandlers.call(config, data);

    _(additionalHandlers).each(({ config, handler, data }) => {
      this._handleChange(config, handler, data, logs, notifications);
    });
  },

  _createLog(config, handler, data) {
    if (handler.shouldCreateLog
          && !handler.shouldCreateLog.call(config, data)) {
      return;
    }

    const { FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED } = ChangesKinds;
    const { diffs, newDoc } = data;
    const { updatedAt:date, updatedBy:executor } = newDoc;
    const { kind, field, newValue, oldValue } = diffs[handler.field] || {};

    const logTemplate = handler.logTemplate;
    const sourceTemplate = _(logTemplate).isObject() ? logTemplate[kind] : logTemplate;

    const template = Handlebars.compile(sourceTemplate);
    const templateData = handler.logData.call(config, data);
    const message = template(templateData);

    const documentId = data.documentId || config.docId(newDoc);
    const collection = config.collectionName;

    const log = { date, executor, field, collection, documentId, message };

    if (_([FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED]).contains(kind)) {
      _(log).extend({ newValue, oldValue });
    }

    return log;
  },

  _createNotification(config, handler, data) {
    if (handler.shouldSendNotification
          && !handler.shouldSendNotification.call(config, data)) {
      return;
    }

    const { kind } = data.diffs[handler.field] || {};

    const notificationTemplate = handler.notificationTemplate;
    const sourceTemplate = _(notificationTemplate).isObject()
        ? notificationTemplate[kind]
        : notificationTemplate;

    const template = Handlebars.compile(sourceTemplate);
    const templateData = handler.notificationData.call(config, data);
    const text = template(templateData);

    const receivers = handler.notificationReceivers.call(config, data);

    return { text, receivers };
  },

  _saveLogs(logs) {
    _(logs).each(log => AuditLogs.insert(log));
  },

  _sendNotifications(notifications) {

  }

};
