import { ActionStatuses, ProblemTypes, CollectionNames } from '../constants.js';
import { Actions } from './actions.js';
import { NonConformities } from '../non-conformities/non-conformities.js';
import { Risks } from '../risks/risks.js';
import DocumentUpdateAudit from '../audit-base/DocumentUpdateAudit.js';


export default class ActionUpdateAudit extends DocumentUpdateAudit {

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      switch (diff.field) {
        case 'isCompleted':
          this._completionChanged(diff);
          break;
        case 'isVerified':
          this._verificationChanged(diff);
          break;
        case 'linkedTo':
          this._linkedDocChanged(diff);
          break;
        case 'status':
          this._statusChanged(diff);
          break;
        case 'ownerId':
        case 'toBeCompletedBy':
        case 'toBeVerifiedBy':
          this._userChanged(diff);
          break;
      }
    });

    super._buildLogs();
  }

  _completionChanged(diff) {
    const completedAtDiff = _(this._diff).find(({ field }) => field === 'completedAt');
    const completedByDiff = _(this._diff).find(({ field }) => field === 'completedBy');

    if (!(completedAtDiff && completedByDiff)) {
      return;
    }

    const { newValue } = diff;
    let message;
    if (newValue === true) {
      message = 'Completed';
    } else if (newValue === false) {
      message = 'Completion canceled';
    }

    if (!message) {
      return;
    }

    this._createLog({ message });

    diff.isProcessed = true;
    completedAtDiff.isProcessed = true;
    completedByDiff.isProcessed = true;
  }

  _verificationChanged(diff) {
    const verifiedAtDiff = _(this._diff).find(({ field }) => field === 'verifiedAt');
    const verifiedByDiff = _(this._diff).find(({ field }) => field === 'verifiedBy');

    if (!(verifiedAtDiff && verifiedByDiff)) {
      return;
    }

    const { newValue } = diff;
    const { isVerifiedAsEffective } = this._newDoc;
    let message;
    if (newValue === true) {
      if (isVerifiedAsEffective === true) {
        message = 'Verified as effective';
      } else {
        message = 'Failed verification';
      }
    } else if (newValue === false) {
      message = 'Verification canceled';
    }

    if (!message) {
      return;
    }

    this._createLog({ message });

    diff.isProcessed = true;
    verifiedAtDiff.isProcessed = true;
    verifiedByDiff.isProcessed = true;
  }

  _linkedDocChanged(diff) {
    const { ITEM_ADDED, ITEM_REMOVED } = this.constructor._changesTypes;

    const { sequentialId, title } = this._newDoc;
    const actionName = `${sequentialId} "${title}"`;

    const { kind, item:linkedDoc } = diff;
    let message, linkedDocMessage;

    if (kind === ITEM_ADDED) {
      message = 'Linked to [docName]';
      linkedDocMessage = `${actionName} linked`;
    } else if (kind === ITEM_REMOVED) {
      message = 'Unlinked from [docName]';
      linkedDocMessage = `${actionName} unlinked`;
    }

    if (!(_(linkedDoc).isObject() && message && linkedDocMessage)) {
      return;
    }

    const { documentId, documentType } = linkedDoc;
    const docCollections = {
      [ProblemTypes.NC]: NonConformities,
      [ProblemTypes.RISK]: Risks
    };
    const docCollection = docCollections[documentType];
    const doc = docCollection.findOne({ _id: documentId });

    const docName = (doc && `${doc.sequentialId} "${doc.title}"`) || documentId;
    message = message.replace('[docName]', docName);

    this._createLog({
      message,
      field: 'linkedTo'
    });

    const collectionNames = {
      [ProblemTypes.NC]: CollectionNames.NCS,
      [ProblemTypes.RISK]: CollectionNames.RISKS
    };
    this._createLog({
      collection: collectionNames[documentType],
      message: linkedDocMessage,
      documentId
    });

    diff.isProcessed = true;
  }

  _statusChanged(diff) {
    this._prettifyValues(diff, val => ActionStatuses[val]);
  }

  static get _fieldLabels() {
    const fieldLabels = {
      completedAt: 'Completed at',
      completedBy: 'Completed by',
      completionTargetDate: 'Completion target date',
      isCompleted: 'Completed',
      isVerified: 'Verified',
      isVerifiedAsEffective: 'Verified as effective',
      linkedTo: 'Linked to',
      ownerId: 'Owner',
      planInPlace: 'Plan in place',
      sequentialId: 'Sequential ID',
      serialNumber: 'Serial number',
      status: 'Status',
      title: 'Title',
      toBeCompletedBy: 'Completion executor',
      toBeVerifiedBy: 'Verification executor',
      type: 'Type',
      verificationTargetDate: 'Verification target date',
      verifiedAt: 'Verified at',
      verifiedBy: 'Verified by'
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

  static get _collection() {
    return CollectionNames.ACTIONS;
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
