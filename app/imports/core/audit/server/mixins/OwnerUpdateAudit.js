export default (base) => class extends base {

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      switch (diff.field) {
        case 'ownerId':
        case 'owner':
          this._userChanged(diff);
          break;
      }
    });

    super._buildLogs();
  }

  static get _fieldLabels() {
    const fieldLabels = {
      ownerId: 'Owner',
      owner: 'Owner'
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

}
