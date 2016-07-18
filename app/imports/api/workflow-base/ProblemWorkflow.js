import { WorkflowTypes } from '../constants.js';
import { Organizations } from '../organizations/organizations.js';
import { isDueToday, isOverdue } from '../checkers.js';

import Workflow from './Workflow.js';


export default class ProblemWorkflow extends Workflow {

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
        || this._getStandardUpdateStatus()
        || this._getActionStatus()
        || this._getAnalysisStatus()
        || 2;
  }

  _getDeletedStatus() {
    if (this._doc.isDeleted) {
      return 18; // Deleted
    }
  }

  _getStandardUpdateStatus() {
    const { updateOfStandards } = this._doc || {};
    const { status, completedAt, completedBy } = updateOfStandards || {};

    const isStandardUpdated = _.every([
      status === 1,
      !!completedAt,
      !!completedBy
    ]);

    if (isStandardUpdated) {
      return 17; // Closed - action(s) verified, standard(s) reviewed
    }
  }

  _getActionStatus() {
    const actions = Actions.find({
      'linkedTo.documentId': this._id,
      isDeleted: false
    }).fetch();

    const actionsLength = actions.length;

    if (actionsLength === 0) {
      return;
    }

    const workflowType = this._getWorkflowType();
    let actionChecks = [];

    if (workflowType === WorkflowTypes.THREE_STEP) {
      actionChecks = this._getThreeStepActionChecks();
    } else if (workflowType === WorkflowTypes.SIX_STEP) {
      actionChecks = this._getSixStepActionChecks();
    }

    for (let i = 0; i < actionChecks.length; i++) {
      const fn = actionChecks[i];
      const status = fn(actions);

      if (_.isFinite(status)) {
        return status;
      }
    }
  }

  _getThreeStepActionChecks() {
    return [
      // check if all actions are completed
      (actions) => {
        const completedLength = _.filter(actions, ({ status }) => {
          // 4: In progress - completed, not yet verified
          // 9: Completed
          return (status === 4) || (status === 9);
        }).length;
        // 16: Closed - action(s) completed
        return (completedLength === actions.length) ? 16 : false;
      },

      // check if there is overduded action
      (actions) => {
        const overduded = _.find(actions, ({ status }) => {
          return status === 3; // In progress - completion overdue
        });
        // 9: Open - action(s) overdue
        return !!overduded ? 9 : false;
      },

      // check if there is an action that must completed today
      (actions) => {
        const dueToday = _.find(actions, ({ status }) => {
          return status === 2; // In progress - due for completion today
        });
        // 8: Open - action(s) due today
        return !!dueToday ? 8 : false;
      },

      // check if there is at least one completed action
      (actions) => {
        const completed = _.find(actions, ({ status }) => {
          // 4: In progress - completed, not yet verified
          // 9: Completed
          return (status === 4) || (status === 9);
        });
        // 10: Open - action(s) completed
        return !!completed ? 10 : false;
      }
    ];
  }

  _getSixStepActionChecks() {
    return [
      // check if all actions are verified
      (actions) => {
        const verifiedLength = _.filter(actions, ({ status }) => {
          return status === 8; // Completed - verified as effective
        }).length;
        // 14: Open - action(s) verified as effective, awaiting update of standard(s)
        return (verifiedLength === actions.length) ? 14 : false;
      },

      // check if there is overduded verification
      (actions) => {
        const overduded = _.find(actions, ({ status }) => {
          return status === 6; // In progress - completed, verification overdue
        });
        // 13: Open - verification past due
        return !!overduded ? 13 : false;
      },

      // check if there is verification for today
      (actions) => {
        const dueToday = _.find(actions, ({ status }) => {
          return status === 5; // In progress - completed, verification due today
        });
        // 12: Open - verification due today
        return !!overduded ? 12 : false;
      },

      // check if there is failed verification
      (actions) => {
        const failed = _.find(actions, ({ status }) => {
          return status === 7; // Completed - failed verification
        });
        // 15: Open - action(s) failed verification
        return !!failed ? 15 : false;
      },

      // check if there is overduded action
      (actions) => {
        const overduded = _.find(actions, ({ status }) => {
          return status === 3; // In progress - completion overdue
        });
        // 9: Open - action(s) overdue
        return !!overduded ? 9 : false;
      },

      // check if there is an action that must completed today
      (actions) => {
        const dueToday = _.find(actions, ({ status }) => {
          return status === 2; // In progress - due for completion today
        });
        // 8: Open - action(s) due today
        return !!dueToday ? 8 : false;
      },

      // check if there is at least one completed action
      (actions) => {
        const completed = _.find(actions, ({ status }) => {
          // 4: In progress - completed, not yet verified
          // 9: Completed
          return (status === 4) || (status === 9);
        }).length;
        // 11: Open - action(s) completed, awaiting verification
        return !!completed ? 11 : false;
      },
    ];
  }

  _getAnalysisStatus() {
    const { analysis } = this._doc || {};
    const { status, targetDate, completedAt, completedBy } = analysis || {};

    const isAnalysisCompleted = _.every([
      status === 1,
      !!completedAt,
      !!completedBy
    ]);

    if (isAnalysisCompleted) {
      const actionsCount = Actions.find({
        'linkedTo.documentId': this._id,
        isDeleted: false
      }).count();

      if (actionsCount > 0) {
        return 7; // Open - analysis completed, action(s) in place
      } else {
        return 6; // Open - analysis completed, action needed
      }
    }

    const timezone = this._timezone;

    if (isOverdue(targetDate, timezone)) {
      return 5; // Open - analysis overdue
    }

    if (isDueToday(targetDate, timezone)) {
      return 4; // Open - analysis due today
    }
  }

}
