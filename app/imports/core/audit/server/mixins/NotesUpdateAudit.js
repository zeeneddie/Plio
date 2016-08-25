export default (base) => class extends base {

  static get _fieldLabels() {
    const fieldLabels = {
      notes: 'Notes'
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

  static get _messages() {
    const changesTypes = this._changesTypes;

    const messages = {
      notes: {
        [changesTypes.FIELD_ADDED]: 'Notes set',
        [changesTypes.FIELD_CHANGED]: 'Notes changed',
        [changesTypes.FIELD_REMOVED]: 'Notes removed',
      }
    };

    return _(messages).extend(super._messages);
  }
}
