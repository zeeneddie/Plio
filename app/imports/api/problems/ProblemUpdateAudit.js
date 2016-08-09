import { ActionStatuses, ProblemTypes } from '../constants.js';
import { Actions } from './actions.js';
import { NonConformities } from '../non-conformities/non-conformities.js';
import { Risks } from '../risks/risks.js';
import DocumentUpdateAudit from '../audit-base/DocumentUpdateAudit.js';


export default class ProblemUpdateAudit extends DocumentUpdateAudit {

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      switch (diff.field) {

      }
    });

    super._buildLogs();
  }

  static get _fieldLabels() {
    const fieldLabels = {
      
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

}
