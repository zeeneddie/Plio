import { WorkflowTypes } from '../constants.js';
import { Organizations } from '../organizations/organizations.js';
import { isDueToday, isOverdue } from '../checkers.js';

import Workflow from '../workflow-base/Workflow.js';


export default class ProblemWorkflow extends Workflow {

  constructor(_id) {
    super(_id);
    this._linkedActions = Actions.find({
      'linkedTo.documentId': _id,
      isDeleted: false
    });
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

  _getDeletedStatus() {
    if (this._doc.deleted()) {
      return 18; // Deleted
    }
  }

  _getStandardsUpdateStatus() {
    if (this._doc.areStandardsUpdated()) {
      return 17; // Closed - action(s) verified, standard(s) reviewed
    }
  }

  _getActionStatus() {
    const actions = this._linkedActions.fetch();

    if (actions.length === 0) {
      return;
    }

    const workflowType = this._getWorkflowType();

    if (workflowType === WorkflowTypes.THREE_STEP) {
      return this._getActionCompletionStatus(actions);
    } else if (workflowType === WorkflowTypes.SIX_STEP) {
      return this._getActionVerificationStatus(actions)
          || this._getActionCompletionStatus(actions);
    }
  }

  _getActionVerificationStatus(actions) {
    // check if all actions are verified
    const verifiedLength = _.filter(actions, ({ status }) => {
      return status === 8; // Completed - verified as effective
    }).length;

    if (verifiedLength === actions.length) {
      return 14; // Open - action(s) verified as effective, awaiting update of standard(s)
    }

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
      return 15; // Open - action(s) failed verification
    }
  }

  _getActionCompletionStatus(actions) {
    const workflowType = this._getWorkflowType();

    // check if all actions are completed
    const completedLength = _.filter(actions, ({ status }) => {
      // 4: In progress - completed, not yet verified
      // 5: In progress - completed, verification due today
      // 6: In progress - completed, verification overdue
      // 7: Completed - failed verification
      // 8: Completed - verified as effective
      // 9: Completed
      return _.contains([4, 5, 6, 7, 8, 9], status);
    }).length;

    if (completedLength === actions.length) {
      const completedStatuses = {
        [WorkflowTypes.THREE_STEP]: 16, // Closed - action(s) completed
        [WorkflowTypes.SIX_STEP]: 11 // Open - action(s) completed, awaiting verification
      };

      return completedStatuses[workflowType];
    }

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
    if (completedLength >= 1) {
      const completedStatuses = {
        [WorkflowTypes.THREE_STEP]: 10, // Open - action(s) completed
        [WorkflowTypes.SIX_STEP]: 11 // Open - action(s) completed, awaiting verification
      };

      return completedStatuses[workflowType];
    }
  }

  _getAnalysisStatus() {
    const doc = this._doc;

    if (doc.isAnalysisCompleted()) {
      const actionsCount = this._linkedActions.count();
      if (actionsCount > 0) {
        return 7; // Open - analysis completed, action(s) in place
      }

      return 6; // Open - analysis completed, action needed
    }

    const { analysis } = doc || {};
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
