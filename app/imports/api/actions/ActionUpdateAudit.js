import { ActionStatuses, ProblemTypes } from '../constants.js';
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
        case 'linkedTo':
          this._linkedDocChanged(diff);
          break;
        case 'isCompleted':
          this._completionChanged(diff);
          break;
        case 'isVerified':
          this._verificationChanged(diff);
          break;
        case 'status':
          this._statusChanged(diff);
          break;
      }
    });

    super._buildLogs();
  }

  _linkedDocChanged(diff) {
    const changesTypes = this.constructor._changesTypes;

    const { sequentialId, title } = this._newDoc;
    const actionName = `${sequentialId} "${title}"`;

    const linkedDoc = diff.removedItem || diff.addedItem;
    const { documentId, documentType } = linkedDoc;

    const docCollections = {
      [ProblemTypes.NC]: NonConformities,
      [ProblemTypes.RISK]: Risks
    };
    const docCollection = docCollections[documentType];
    const doc = docCollection.findOne({ _id: documentId });
    const docName = `${doc.sequentialId} "${doc.title}"`;

    const { kind } = diff;
    let message, linkedDocMessage;
    if (kind === changesTypes.ITEM_ADDED) {
      message = `Linked to ${docName}`;
      linkedDocMessage = `Action ${actionName} linked`;
    } else if (kind === changesTypes.ITEM_REMOVED) {
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

  _statusChanged(diff) {
    const { oldValue, newValue } = diff;

    const oldStatus = ActionStatuses[oldValue];
    const newStatus = ActionStatuses[newValue];

    this._createLog({
      message: `Status changed from "${oldStatus}" to "${newStatus}"`
    });

    diff.isProcessed = true;
  }

  static get _fieldLabels() {
    const fieldLabels = {
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

    return _(fieldLabels).extend(super._fieldLabels);
  }

  static get _collection() {
    return 'Actions';
  }

};
