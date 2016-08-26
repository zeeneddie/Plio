export default (base) => class extends base {

  static get _fieldLabels() {
    const fieldLabels = {
      description: 'Description'
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

  static get _messages() {
    const { FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED } = this._changesTypes;

    const messages = {
      description: {
        [FIELD_ADDED]: 'Description set',
        [FIELD_CHANGED]: 'Description changed',
        [FIELD_REMOVED]: 'Description removed'
      }
    };

    return _(messages).extend(super._messages);
  }
}
