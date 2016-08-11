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
          this._refChanged(diff);
          break;
      }
    });

    super._buildLogs();
  }

  _refChanged(diff) {
    const { FIELD_ADDED, FIELD_REMOVED } = this.constructor._changesTypes;

    const { kind, newValue, oldValue } = diff;
    let ref, message;

    if (kind === FIELD_ADDED) {
      ref = newValue;
      message = 'Help desk reference added: [refDesc]';
    } else if (kind === FIELD_REMOVED) {
      ref = oldValue;
      message = 'Help desk reference removed: [refDesc]';
    }

    if (!(message && _(ref).isObject())) {
      return;
    }

    const { text, url } = ref;
    const refDesc = [];

    if (text !== undefined) {
      refDesc.push(`ID - ${text}`);
    }

    if (url !== undefined) {
      refDesc.push(`URL - ${url}`);
    }

    if (refDesc.length) {
      message = message.replace('[refDesc]', refDesc.join(', '));
    } else {
      message = /^(Help desk reference (?:added|removed))/.exec(message)[1];
    }

    this._createLog({ message });

    diff.isProcessed = true;
  }

  static get _collection() {
    return CollectionNames.NCS;
  }

  static get _fieldLabels() {
    const fieldLabels = {
      cost: 'Approx cost per occurrence',
      ref: 'Help desk reference',
      'ref.text': 'Help desk reference ID',
      'ref.url': 'Help desk reference url'
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

}
