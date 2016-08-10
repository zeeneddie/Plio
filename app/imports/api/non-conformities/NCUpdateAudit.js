import { CollectionNames } from '../constants.js';
import ProblemUpdateAudit from '../problems/ProblemUpdateAudit.js';


export default class NCUpdateAudit extends ProblemUpdateAudit {

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      switch (diff.field) {
        case 'ref':
          this._refSet(diff);
          break;
      }
    });

    super._buildLogs();
  }

  _refSet(diff) {
    const { FIELD_ADDED } = this.constructor._changesTypes;

    const { kind } = diff;
    if (kind !== FIELD_ADDED) {
      return;
    }

    const { newValue: { text='', url='' } = {} } = diff;
    const message = `Help desk reference created: ID="${text}, url="${url}"`;

    this._createLog({ message });

    diff.isProcessed = true;
  }

  static get _collection() {
    return CollectionNames.NCS;
  }

  static get _fieldLabels() {
    const fieldLabels = {
      cost: 'Approx cost per occurrence',
      'ref.text': 'Help desk reference ID',
      'ref.url': 'Help desk reference url'
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

}
