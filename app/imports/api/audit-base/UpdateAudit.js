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

    _(rawDiffs).each(rawDiff => {
      const { kind, path } = rawDiff;
      const field = _(path).map(field => _(field).isNumber() ? '$': field).join('.');
      let diff;

      if (kind === 'A') {
        const { ITEM_ADDED, ITEM_REMOVED } = this.constructor._changesTypes;
        const { item: { kind, lhs, rhs } } = rawDiff;

        let item;
        if (kind === 'N') {
          item = rhs;
        } else if (kind === 'D') {
          item = lhs;
        }

        const changesKinds = {
          N: ITEM_ADDED,
          D: ITEM_REMOVED
        };

        diff = {
          kind: changesKinds[kind],
          isFromArray: true,
          field,
          item,
          path
        };
      } else {
        const { FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED } = this.constructor._changesTypes;
        const { lhs:oldValue, rhs:newValue } = rawDiff;

        const changesKinds = {
          N: FIELD_ADDED,
          E: FIELD_CHANGED,
          D: FIELD_REMOVED
        };

        diff = {
          kind: changesKinds[kind],
          isFromArray: false,
          field,
          oldValue,
          newValue,
          path
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
        const { item, prettyItem } = diff;
        msgData = { item: prettyItem || item };
      } else {
        const { prettyOldValue, prettyNewValue } = diff;
        msgData = {
          oldValue: prettyOldValue || oldValue,
          newValue: prettyNewValue || newValue
        };
      }

      const logMessage = this._buildLogMessage(kind, field, msgData);

      this._createLog({
        message: logMessage,
        field,
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

  _prettifyValues(diff, fn) {
    const keys = {
      oldValue: 'prettyOldValue',
      newValue: 'prettyNewValue'
    };

    const diffValues = _(diff).pick(['oldValue', 'newValue']);

    _(diffValues).each((val, key) => {
      if (val === undefined) {
        return;
      }
      const prettyVal = fn(val);
      prettyVal && (diff[keys[key]] = prettyVal);
    });
  }

  _prettifyArrayItem(diff, fn) {
    const { item } = diff;

    if (item !== undefined) {
      const prettyItem = fn(item);
      prettyItem && (diff.item = prettyItem);
    }
  }

  _createLog({ message, field, oldValue, newValue, ...rest }) {
    const log = _.extend({
      collection: this.constructor._collection,
      documentId: this._documentId,
      date: this._updatedAt,
      executor: this._updatedBy,
    }, {
      message,
      field,
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
      [changesTypes.FIELD_ADDED]: '[field] set to "[newValue]"',
      [changesTypes.FIELD_CHANGED]: '[field] changed from "[oldValue]" to "[newValue]"',
      [changesTypes.FIELD_REMOVED]: '[field] removed',
      [changesTypes.ITEM_ADDED]: '"[item]" added to [field] list',
      [changesTypes.ITEM_REMOVED]: '"[item]" removed from [field] list'
    };
  }

  static get _messages() {
    // implement in child class
  }

  static get _collection() {
    // implement in child class
  }

}
