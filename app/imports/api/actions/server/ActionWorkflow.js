import { Actions } from '../actions.js';
import { ProblemMagnitudes, WorkflowTypes } from '../../constants.js';
import { isDueToday, isOverdue } from '../../checkers.js';

import Workflow from '../../workflow-base/Workflow.js';


export default class ActionWorkflow extends Workflow {

  constructor(_id) {
    super(_id);
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

  _getDeletedStatus() {
    if (this._doc.isDeleted) {
      return 10; // Deleted
    }
  }

  _getCompletionStatus() {
    const {
      isCompleted, completedBy,
      completedAt, completionTargetDate
    } = this._doc;

    const isActionCompleted = _.every([
      isCompleted === true,
      !!completedAt,
      !!completedBy
    ]);

    if (isActionCompleted) {
      return 4; // In progress - completed, not yet verified
    }

    const timezone = this._timezone;

    if (isOverdue(completionTargetDate, timezone)) {
      return 3; // In progress - completion overdue
    }

    if (isDueToday(completionTargetDate, timezone)) {
      return 2; // In progress - due for completion today
    }
  }

  _getVerificationStatus() {
    const {
      isVerified, verifiedBy,
      verifiedAt, isVerifiedAsEffective,
      verificationTargetDate
    } = this._doc;

    const isActionVerified = _.every([
      isVerified === true,
      !!verifiedAt,
      !!verifiedBy
    ]);

    if (isActionVerified) {
      if (isVerifiedAsEffective) {
        return 7; // Completed - failed verification
      } else {
        return 8; // Completed - verified as effective
      }
    }

    const timezone = this._timezone;

    if (isOverdue(verificationTargetDate, timezone)) {
      return 6; // In progress - completed, verification overdue
    }

    if (isDueToday(verificationTargetDate, timezone)) {
      return 5; // In progress - completed, verification due today
    }
  }

  _getWorkflowType() {
    const linkedDocs = this._doc.getLinkedDocuments();

    if (linkedDocs.length === 0) {
      return WorkflowTypes.THREE_STEP;
    }

    const docsByMagnitude = _.groupBy(linkedDocs, doc => doc.magnitude);

    const withHighestMagnitude = docsByMagnitude[ProblemMagnitudes.CRITICAL]
        || docsByMagnitude[ProblemMagnitudes.MAJOR]
        || docsByMagnitude[ProblemMagnitudes.MINOR]
        || [];

    const docsByWorkflowType = _.groupBy(withHighestMagnitude, doc => doc.workflowType);

    const withHighestWorkflow = docsByWorkflowType[WorkflowTypes.SIX_STEP]
        || docsByWorkflowType[WorkflowTypes.THREE_STEP]
        || [];

    return (withHighestWorkflow.length && withHighestWorkflow[0].workflowType)
        || WorkflowTypes.THREE_STEP;
  }

  static _collection() {
    return Actions;
  }

}
