import { WorkflowTypes } from '/imports/api/constants.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { isDueToday, isOverdue } from '/imports/api/checkers.js';

import Workflow from './Workflow.js';
import WorkItemWorkflow from './WorkItemWorkflow.js';


export default class ProblemWorkflow extends Workflow {

  constructor(idOrDoc) {
    super(idOrDoc);

    const actions = Actions.find({
      'linkedTo.documentId': this._id,
      isDeleted: false,
      deletedAt: { $exists: false },
      deletedBy: { $exists: false }
    }).fetch();

    this._actions = actions;

    this._completedActionsLength = this._getCompletedActionsLength();

    let verifiedLength;
    if (this._getWorkflowType() === WorkflowTypes.SIX_STEP) {
      verifiedLength = this._getVerifiedActionsLength();
    }
    this._verifiedActionsLength = verifiedLength;
  }

  _getVerifiedActionsLength() {
    return _.filter(this._actions, ({ status }) => {
      return status === 8; // Completed - verified as effective
    }).length;
  }

  _getCompletedActionsLength() {
    return _.filter(this._actions, ({ status }) => {
      // 4: In progress - completed, not yet verified
      // 5: In progress - completed, verification due today
      // 6: In progress - completed, verification overdue
      // 7: Completed - failed verification
      // 8: Completed - verified as effective
      // 9: Completed
      return _.contains([4, 5, 6, 7, 8, 9], status);
    }).length;
  }

  _standardsUpdated() {
    return this._doc.areStandardsUpdated();
  }

  _allActionsVerified() {
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
    // 3: Open - just reported, awaiting action
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

  _onUpdateStatus(status) {
    const workItems = this._doc.getWorkItems();
    _(workItems).each(doc => new WorkItemWorkflow(doc).refreshStatus());
  }

  _getDeletedStatus() {
    if (this._doc.deleted()) {
      return 20; // Deleted
    }
  }

  _getStandardsUpdateStatus() {
    if (!(this._analysisCompleted()
          && this._allActionsCompleted()
          && this._allActionsVerified())) {
      return;
    }

    if (this._standardsUpdated()) {
      return 19; // Closed - action(s) verified, standard(s) reviewed
    }

    const { updateOfStandards } = this._doc || {};
    const { targetDate } = updateOfStandards || {};
    const timezone = this._timezone;

    if (isOverdue(targetDate, timezone)) {
      return 16; // Open - action(s) verified as effective, update of standard(s) past due
    }

    if (isDueToday(targetDate, timezone)) {
      return 15; // Open - action(s) verified as effective, update of standard(s) due today
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
    if (this._allActionsVerified()) {
      return 14; // Open - action(s) verified as effective, awaiting update of standard(s)
    }

    const actions = this._actions;

    // check if there is overduded verification
    const overduded = _.find(actions, ({ status }) => {
      return status === 6; // In progress - completed, verification overdue
    });

    if (overduded) {
      return 13; // Open - verification past due
    }

    // check if there is verification for today
    const dueToday = _.find(actions, ({ status }) => {
      return status === 5; // In progress - completed, verification due today
    });

    if (dueToday) {
      return 12; // Open - verification due today
    }

    // check if there is failed verification
    const failed = _.find(actions, ({ status }) => {
      return status === 7; // Completed - failed verification
    });

    if (failed) {
      return 17; // Open - action(s) failed verification
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
      const completedStatuses = {
        [WorkflowTypes.THREE_STEP]: 18, // Closed - action(s) completed
        [WorkflowTypes.SIX_STEP]: 11 // Open - action(s) completed, awaiting verification
      };

      return completedStatuses[workflowType];
    }

    const actions = this._actions;

    // check if there is overduded action
    const overduded = _.find(actions, ({ status }) => {
      return status === 3; // In progress - completion overdue
    });

    if (overduded) {
      return 9; // Open - action(s) overdue
    }

    // check if there is an action that must completed today
    const dueToday = _.find(actions, ({ status }) => {
      return status === 2; // In progress - due for completion today
    });

    if (dueToday) {
      return 8; // Open - action(s) due today
    }

    // check if there is at least one completed action
    if (this._completedActionsLength >= 1) {
      const completedStatuses = {
        [WorkflowTypes.THREE_STEP]: 10, // Open - action(s) completed
        [WorkflowTypes.SIX_STEP]: 11 // Open - action(s) completed, awaiting verification
      };

      return completedStatuses[workflowType];
    }
  }

  _getAnalysisStatus() {
    if (this._analysisCompleted()) {
      if (this._actions.length > 0) {
        return 7; // Open - analysis completed, action(s) in place
      }

      return 6; // Open - analysis completed, action needed
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
