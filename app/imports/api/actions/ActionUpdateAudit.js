import { ActionStatuses, ProblemTypes } from '../constants.js';
import { Actions } from './actions.js';
import { NonConformities } from '../non-conformities/non-conformities.js';
import { Risks } from '../risks/risks.js';
import UpdateAudit from '../audit-base/UpdateAudit.js';


export default class ActionUpdateAudit extends UpdateAudit {

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      const { field } = diff;

      if (field === 'linkedTo') {
        this._linkedDocChanged(diff);
      } else if (field === 'isCompleted') {
        this._completionChanged(diff);
      } else if (field === 'isVerified') {
        this._verificationChanged(diff);
      } else if (field === 'status') {
        this._statusChanged(diff);
      }
    });
  }

  _linkedDocChanged(diff) {
    const { kind } = diff;
    const { sequentialId, title } = this._newDoc;
    const actionName = `${sequentialId} "${title}"`;
    const changesTypes = this.constructor._changesTypes;

    let linkedDoc;
    if (kind === changesTypes.ITEM_ADDED) {
      linkedDoc = diff.addedItem;
    } else if (kind === changesTypes.ITEM_REMOVED) {
      linkedDoc = diff.removedItem;
    }

    const { documentId, documentType } = linkedDoc;
    const docCollections = {
      [ProblemTypes.NC]: NonConformities,
      [ProblemTypes.RISK]: Risks
    };
    const docCollection = docCollections[documentType];
    const doc = docCollection.findOne({ _id: documentId });
    const docName = `${doc.sequentialId} "${doc.title}"`;

    let message, linkedDocMessage;
    if (kind === changesTypes.ITEM_ADDED) {
      linkedDoc = diff.addedItem;
      message = `Linked to ${docName}`;
      linkedDocMessage = `Action ${actionName} linked`;
    } else if (kind === changesTypes.ITEM_REMOVED) {
      linkedDoc = diff.removedItem;
      message = `Unlinked from ${docName}`;
      linkedDocMessage = `Action ${actionName} unlinked`;
    }

    this._createLog({ message });

    const collectionNames = {
      [ProblemTypes.NC]: 'NonConformities',
      [ProblemTypes.RISK]: 'Risks'
    };

    this._createLog({
      collection: collectionNames[documentType],
      message: linkedDocMessage,
      documentId
    });

    diff.isProcessed = true;
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
      message = 'Action completed';
    } else if (newValue === false) {
      message = 'Action completion canceled';
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
        message = 'Action verified as effective';
      } else {
        message = 'Action failed verification';
      }
    } else if (newValue === false) {
      message = 'Action verification canceled';
    }

    if (!message) {
      return;
    }

    this._createLog({ message });

    diff.isProcessed = true;
    verifiedAtDiff.isProcessed = true;
    verifiedByDiff.isProcessed = true;
  }

  _statusChanged(diff) {
    const { oldValue, newValue } = diff;

    const oldStatus = ActionStatuses[oldValue];
    const newStatus = ActionStatuses[newValue];

    this._createLog({
      message: `Status changed from "${oldStatus}" to "${newStatus}"`
    });
  }

  static get _fieldLabels() {
    return {
      organizationId: 'Organization ID',
      type: 'Type',
      linkedTo: 'Linked to',
      serialNumber: 'Serial number',
      sequentialId: 'Sequential ID',
      title: 'Title',
      ownerId: 'Owner ID',
      planInPlace: 'Plan in place',
      status: 'Status',
      toBeCompletedBy: 'To be completed by',
      completionTargetDate: 'Completion target date',
      isCompleted: 'Is completed',
      completedAt: 'Completed at',
      completedBy: 'Completed by',
      toBeVerifiedBy: 'To be verified by',
      verificationTargetDate: 'Verification target date',
      isVerified: 'Is verified',
      isVerifiedAsEffective: 'Is verified as effective',
      verifiedAt: 'Verified at',
      verifiedBy: 'Verified by'
    };
  }

  static get _ignoredFields() {

  }

  static get _messages() {

  }

  static get _collection() {
    return 'Actions';
  }

};
