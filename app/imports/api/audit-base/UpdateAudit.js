import deepDiff from 'deep-diff';
import moment from 'moment-timezone';


export default class UpdateAudit {

  constructor(newDocument, oldDocument) {
    this._newDoc = newDocument;
    this._oldDoc = oldDocument;

    this._updatedAt = newDocument.updatedAt;
    this._updatedBy = newDocument.updatedBy;
    this._documentId = newDocument._id;

    this._diff = [];
    this._logs = [];
  }

  getLogs() {
    this._buildDiff();
    this._cleanDiff();
    this._buildLogs();
    this._resetDiff();

    return this._logs;
  }

  _buildDiff() {
    const rawDiffs = deepDiff.diff(this._oldDoc, this._newDoc);
    const changesTypes = this.constructor._changesTypes;

    _(rawDiffs).each(rawDiff => {
      const { kind, path } = rawDiff;
      const field = path.join('.');
      let diff;

      if (kind === 'A') {
        const { item: { kind, lhs:removedItem, rhs:addedItem } } = rawDiff;

        const changesKinds = {
          N: changesTypes.ITEM_ADDED,
          D: changesTypes.ITEM_REMOVED
        };

        diff = {
          kind: changesKinds[kind],
          isFromArray: true,
          field,
          removedItem,
          addedItem,
        };
      } else {
        const { lhs:oldValue, rhs:newValue } = rawDiff;

        const changesKinds = {
          N: changesTypes.FIELD_ADDED,
          E: changesTypes.FIELD_CHANGED,
          D: changesTypes.FIELD_REMOVED
        };

        diff = {
          kind: changesKinds[kind],
          isFromArray: false,
          field,
          oldValue,
          newValue
        };
      }

      this._diff.push(diff);
    });
  }

  _cleanDiff() {
    const diff = this._diff;
    const ignoredFields = this.constructor._ignoredFields;
    let i = diff.length;

    while (i--) {
      const { field } = diff[i];
      const index = ignoredFields.indexOf(field);
      if (index > -1) {
        diff.splice(i, 1);
      }
    }
  }

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      const { isFromArray, kind, field, oldValue, newValue } = diff;

      let msgData;
      if (isFromArray) {
        const { addedItem, removedItem } = diff;
        msgData = { addedItem, removedItem };
      } else {
        msgData = { oldValue, newValue };
      }

      const logMessage = this._buildLogMessage(kind, field, msgData);

      this._createLog({
        message: logMessage,
        oldValue,
        newValue
      });

      diff.isProcessed = true;
    });
  }

  _resetDiff() {
    this._diff = [];
  }

  _buildLogMessage(changeKind, field, msgData) {
    const allFieldsMessages = this.constructor._messages;
    const fieldMessages = !!_(allFieldsMessages).isObject() && allFieldsMessages[field];
    let message = _(fieldMessages).isObject()
        ? fieldMessages[changeKind]
        : this.constructor._defaultMessages[changeKind];

    const fieldLabel = this._getFieldLabel(field) || field;
    message = message.replace('[field]', fieldLabel);

    _(msgData).each((val, key) => {
      message = message.replace(`[${key}]`, this._getFieldValue(val));
    });

    return message;
  }

  _getFieldLabel(fieldName) {
    const fieldLabels = this.constructor._fieldLabels;
    return _(fieldLabels).isObject() ? fieldLabels[fieldName] : null;
  }

  _getFieldValue(obj) {
    if (_(obj).isDate()) {
      return moment(obj).tz('UTC').toString();
    } else if (_(obj).isObject()) {
      return JSON.stringify(obj);
    } else {
      return obj;
    }
  }

  _createLog({ message, oldValue, newValue, ...rest }) {
    const log = _.extend({
      collection: this.constructor._collection,
      documentId: this._documentId,
      changedAt: this._updatedAt,
      changedBy: this._updatedBy,
    }, {
      message,
      oldValue,
      newValue,
      ...rest
    });

    this._logs.push(log);
  }

  static get _changesTypes() {
    return {
      FIELD_ADDED: 'field added',
      FIELD_CHANGED: 'field changed',
      FIELD_REMOVED: 'field removed',
      ITEM_ADDED: 'item added',
      ITEM_REMOVED: 'item removed'
    };
  }

  static get _fieldLabels() {
    // implement in child class
  }

  static get _ignoredFields() {
    // implement in child class
  }

  static get _defaultMessages() {
    const changesTypes = this._changesTypes;

    return {
      [changesTypes.FIELD_ADDED]: '[field] set to [newValue]',
      [changesTypes.FIELD_CHANGED]: '[field] changed from [oldValue] to [newValue]',
      [changesTypes.FIELD_REMOVED]: '[field] removed',
      [changesTypes.ITEM_ADDED]: '[addedItem] added to [field] list',
      [changesTypes.ITEM_REMOVED]: '[removedItem] removed from [field] list'
    };
  }

  static get _messages() {
    // implement in child class
  }

  static get _collection() {
    // implement in child class
  }

};
