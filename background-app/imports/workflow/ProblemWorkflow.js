import { WorkflowTypes } from '/imports/share/constants';
import { Actions } from '/imports/share/collections/actions';
import { isDueToday, isOverdue } from '/imports/share/helpers';
import Workflow from './Workflow';


export default class ProblemWorkflow extends Workflow {

  _prepare() {
    super._prepare();

    this._actions = Actions.find({
      'linkedTo.documentId': this._id,
      isDeleted: false,
      deletedAt: { $exists: false },
      deletedBy: { $exists: false },
    }).fetch() || [];

    this._completedActionsLength = this._getCompletedActionsLength();

    let verifiedLength;
    if (this._getWorkflowType() === WorkflowTypes.SIX_STEP) {
      verifiedLength = this._getVerifiedActionsLength();
    }
    this._verifiedActionsLength = verifiedLength;
  }

  _getVerifiedActionsLength() {
    return this._actions.filter(action => action.verifiedAsEffective()).length;
  }

  _getCompletedActionsLength() {
    return this._actions.filter(action => action.completed()).length;
  }

  _standardsUpdated() {
    return this._doc.areStandardsUpdated();
  }

  _allActionsVerifiedAsEffective() {
    const actionsLength = this._actions.length;
    return (actionsLength > 0) && (this._verifiedActionsLength === actionsLength);
  }

  _allActionsCompleted() {
    const actionsLength = this._actions.length;
    return (actionsLength > 0) && (this._completedActionsLength === actionsLength);
  }

  _analysisCompleted() {
    return this._doc.isAnalysisCompleted();
  }

  _getWorkflowType() {
    return this._doc.workflowType;
  }

  _getThreeStepStatus() {
    // 3: Open - just reported, action(s) to be added
    return this._getDeletedStatus() || this._getActionStatus() || 3;
  }

  _getSixStepStatus() {
    // 2: Open - just reported, awaiting analysis
    return this._getDeletedStatus()
        || this._getStandardsUpdateStatus()
        || this._getActionStatus()
        || this._getAnalysisStatus()
        || 2;
  }

  _getDeletedStatus() {
    if (this._doc.deleted()) {
      return 21; // Deleted
    }
  }

  _getStandardsUpdateStatus() {
    if (!(this._analysisCompleted()
          && this._allActionsCompleted()
          && this._allActionsVerifiedAsEffective())) {
      return;
    }

    if (this._standardsUpdated()) {
      return 20; // Closed - action(s) verified, standard(s) reviewed
    }

    const { updateOfStandards } = this._doc || {};
    const { targetDate } = updateOfStandards || {};
    const timezone = this._timezone;

    if (isOverdue(targetDate, timezone)) {
      return 17; // Open - action(s) verified as effective, update of standard(s) past due
    }

    if (isDueToday(targetDate, timezone)) {
      return 16; // Open - action(s) verified as effective, update of standard(s) due today
    }
  }

  _getActionStatus() {
    if (this._actions.length === 0) {
      return;
    }

    const workflowType = this._getWorkflowType();

    if (workflowType === WorkflowTypes.THREE_STEP) {
      return this._getActionCompletionStatus();
    } else if (workflowType === WorkflowTypes.SIX_STEP) {
      return this._getActionVerificationStatus()
          || this._getActionCompletionStatus();
    }
  }

  _getActionVerificationStatus() {
    if (!(this._analysisCompleted() && this._allActionsCompleted())) {
      return;
    }

    // check if all actions are verified
    if (this._allActionsVerifiedAsEffective()) {
      return 15; // Open - action(s) verified as effective, awaiting update of standard(s)
    }

    const actions = this._actions;
    const timezone = this._timezone;

    const unverifiedActions = actions.filter(action => !action.verified());

    // check if there is overduded verification
    const overduded = unverifiedActions.find((action) => (
      isOverdue(action.verificationTargetDate, timezone)
    ));

    if (overduded) {
      return 14; // Open - verification past due
    }

    // check if there is verification for today
    const dueToday = unverifiedActions.find((action) => (
      isDueToday(action.verificationTargetDate, timezone)
    ));

    if (dueToday) {
      return 13; // Open - verification due today
    }

    // check if there is failed verification
    const failed = actions.find(action => action.failedVerification());

    if (failed) {
      return 18; // Open - action(s) failed verification
    }
  }

  _getActionCompletionStatus() {
    const workflowType = this._getWorkflowType();

    if ((workflowType === WorkflowTypes.SIX_STEP)
          && !this._analysisCompleted()) {
      return;
    }

    // check if all actions are completed
    if (this._allActionsCompleted()) {
      return {
        [WorkflowTypes.THREE_STEP]: 19, // Closed - action(s) completed
        [WorkflowTypes.SIX_STEP]: 12, // Open - action(s) completed, awaiting verification
      }[workflowType];
    }

    const actions = this._actions;
    const timezone = this._timezone;

    const uncompletedActions = actions.filter(action => !action.completed());

    // check if there is overduded action
    const overduded = uncompletedActions.find((action) => (
      isOverdue(action.completionTargetDate, timezone)
    ));

    if (overduded) {
      return 10; // Open - action(s) overdue
    }

    // check if there is an action that must completed today
    const dueToday = uncompletedActions.find((action) => (
      isDueToday(action.completionTargetDate, timezone)
    ));

    if (dueToday) {
      return 9; // Open - action(s) due today
    }

    // check if there is at least one completed action
    if (this._completedActionsLength >= 1) {
      return {
        [WorkflowTypes.THREE_STEP]: 11, // Open - action(s) completed
        [WorkflowTypes.SIX_STEP]: 12, // Open - action(s) completed, awaiting verification
      }[workflowType];
    }

    if ((workflowType === WorkflowTypes.THREE_STEP)
          && actions.length) {
      return 8; // Open - action(s) in place
    }
  }

  _getAnalysisStatus() {
    if (this._analysisCompleted()) {
      if (this._actions.length > 0) {
        return 7; // Open - analysis completed, action(s) in place
      }

      return 6; // Open - analysis completed, action(s) need to be added
    }

    const { analysis } = this._doc || {};
    const { targetDate } = analysis || {};
    const timezone = this._timezone;

    if (isOverdue(targetDate, timezone)) {
      return 5; // Open - analysis overdue
    }

    if (isDueToday(targetDate, timezone)) {
      return 4; // Open - analysis due today
    }
  }

}
