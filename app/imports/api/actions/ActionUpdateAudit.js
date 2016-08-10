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
        case 'ownerId':
        case 'toBeCompletedBy':
        case 'toBeVerifiedBy':
          this._userChanged(diff);
          break;
      }
    });

    super._buildLogs();
  }

  _linkedDocChanged(diff) {
    const { ITEM_ADDED, ITEM_REMOVED } = this.constructor._changesTypes;

    const { sequentialId, title } = this._newDoc;
    const actionName = `${sequentialId} "${title}"`;

    const { kind, addedItem, removedItem } = diff;
    let linkedDoc, message, linkedDocMessage;
    if (kind === ITEM_ADDED) {
      linkedDoc = addedItem;
      message = 'Linked to [docName]';
      linkedDocMessage = `${actionName} linked`;
    } else if (kind === ITEM_REMOVED) {
      linkedDoc = removedItem;
      message = 'Unlinked from [docName]';
      linkedDocMessage = `${actionName} unlinked`;
    }

    if (!(linkedDoc && message && linkedDocMessage)) {
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
    this._prettifyValues(diff, val => ActionStatuses[val]);
  }

  _userChanged(diff) {
    this._prettifyValues(diff, (val) => {
      const user = Meteor.users.findOne({ _id: val });
      return user && user.fullNameOrEmail();
    });
  }

  static get _fieldLabels() {
    const fieldLabels = {
      type: 'Type',
      linkedTo: 'Linked to',
      serialNumber: 'Serial number',
      sequentialId: 'Sequential ID',
      title: 'Title',
      ownerId: 'Owner',
      planInPlace: 'Plan in place',
      status: 'Status',
      toBeCompletedBy: 'Completion executor',
      completionTargetDate: 'Completion target date',
      isCompleted: 'Is completed',
      completedAt: 'Completed at',
      completedBy: 'Completed by',
      toBeVerifiedBy: 'Verification executor',
      verificationTargetDate: 'Verification target date',
      isVerified: 'Is verified',
      isVerifiedAsEffective: 'Is verified as effective',
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

    return {
      notes: {
        [changesTypes.FIELD_ADDED]: 'Notes set',
        [changesTypes.FIELD_CHANGED]: 'Notes changed',
        [changesTypes.FIELD_REMOVED]: 'Notes removed',
      }
    };
  }

}
