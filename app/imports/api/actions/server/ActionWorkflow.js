import { Actions } from '../actions.js';
import { WorkflowTypes } from '../../constants.js';
import { isDueToday, isOverdue } from '../../checkers.js';

import Workflow from '../../workflow-base/Workflow.js';
import NCWorkflow from '../../non-conformities/NCWorkflow.js';
import RiskWorkflow from '../../risks/RiskWorkflow.js';

export default class ActionWorkflow extends Workflow {

  constructor(idOrDoc) {
    super(idOrDoc);
    this._workflowType = this._getWorkflowType();
  }

  _getThreeStepStatus() {
    // 1: In progress
    return this._getDeletedStatus() || this._getCompletionStatus() || 1;
  }

  _getSixStepStatus() {
    // 1: In progress
    return this._getDeletedStatus()
        || this._getVerificationStatus()
        || this._getCompletionStatus()
        || 1;
  }

  _onUpdateStatus(status) {
    const action = this._doc;
    const NCs = action.getLinkedNCs();
    const risks = action.getLinkedRisks();

    _.each(NCs, doc => new NCWorkflow(doc).refreshStatus());
    _.each(risks, doc => new RiskWorkflow(doc).refreshStatus());
  }

  _getDeletedStatus() {
    if (this._doc.deleted()) {
      return 10; // Deleted
    }
  }

  _getCompletionStatus() {
    const action = this._doc;

    if (action.completed()) {
      const completedStatuses = {
        [WorkflowTypes.THREE_STEP]: 9, // Completed
        [WorkflowTypes.SIX_STEP]: 4 // In progress - completed, not yet verified
      };

      return completedStatuses[this._workflowType];
    }

    const { completionTargetDate } = action;
    const timezone = this._timezone;

    if (isOverdue(completionTargetDate, timezone)) {
      return 3; // In progress - completion overdue
    }

    if (isDueToday(completionTargetDate, timezone)) {
      return 2; // In progress - due for completion today
    }
  }

  _getVerificationStatus() {
    const action = this._doc;

    if (!action.completed()) {
      return;
    }

    if (action.verified()) {
      if (action.verifiedAsEffective()) {
        return 8; // Completed - verified as effective
      }

      return 7; // Completed - failed verification
    }

    const { verificationTargetDate } = action;
    const timezone = this._timezone;

    if (isOverdue(verificationTargetDate, timezone)) {
      return 6; // In progress - completed, verification overdue
    }

    if (isDueToday(verificationTargetDate, timezone)) {
      return 5; // In progress - completed, verification due today
    }
  }

  _getWorkflowType() {
    return this._doc.getWorkflowType();
  }

  static _collection() {
    return Actions;
  }

}
