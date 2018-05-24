import {
  WorkflowTypes,
  ProblemIndexes,
  ProblemTypes,
} from '../share/constants';
import { Actions, Organizations } from '../share/collections';
import {
  isDueToday,
  isOverdue,
  getWorkflowDefaultStepDate,
} from '../share/helpers';
import { NonConformityService, RiskService } from '../share/services';
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
    return (
      this._getDeletedStatus() ||
      this._getActionStatus() ||
      ProblemIndexes.ACTIONS_TO_BE_ADDED
    );
  }

  _getSixStepStatus() {
    return this._getDeletedStatus()
        || this._getStandardsUpdateStatus()
        || this._getActionStatus()
        || this._getAnalysisStatus()
        || ProblemIndexes.AWAITING_ANALYSIS;
  }

  _getDeletedStatus() {
    if (this._doc.deleted()) {
      return ProblemIndexes.DELETED;
    }

    return undefined;
  }

  _getStandardsUpdateStatus() {
    if (!(
      this._analysisCompleted() &&
      this._allActionsCompleted() &&
      this._allActionsVerifiedAsEffective()
    )) return undefined;

    if (this._standardsUpdated()) {
      return ProblemIndexes.ACTIONS_VERIFIED_STANDARDS_REVIEWED;
    }

    const { updateOfStandards } = this._doc || {};
    const { targetDate } = updateOfStandards || {};
    const timezone = this._timezone;

    if (isOverdue(targetDate, timezone)) {
      return ProblemIndexes.ACTIONS_UPDATE_PAST_DUE;
    }

    if (isDueToday(targetDate, timezone)) {
      return ProblemIndexes.ACTIONS_UPDATE_DUE_TODAY;
    }

    return undefined;
  }

  _getActionStatus() {
    if (this._actions.length === 0) {
      return undefined;
    }

    const workflowType = this._getWorkflowType();

    if (workflowType === WorkflowTypes.THREE_STEP) {
      return this._getActionCompletionStatus();
    } else if (workflowType === WorkflowTypes.SIX_STEP) {
      return this._getActionVerificationStatus()
          || this._getActionCompletionStatus();
    }

    return undefined;
  }

  _getActionVerificationStatus() {
    if (!(this._analysisCompleted() && this._allActionsCompleted())) {
      return undefined;
    }

    // check if all actions are verified
    if (this._allActionsVerifiedAsEffective()) {
      return ProblemIndexes.ACTIONS_AWAITING_UPDATE;
    }

    const actions = this._actions;
    const timezone = this._timezone;

    const unverifiedActions = actions.filter(action => !action.verified());

    // check if there is overduded verification
    const overduded = unverifiedActions.find(action => (
      isOverdue(action.verificationTargetDate, timezone)
    ));

    if (overduded) {
      return ProblemIndexes.VERIFY_PAST_DUE;
    }

    // check if there is verification for today
    const dueToday = unverifiedActions.find(action => (
      isDueToday(action.verificationTargetDate, timezone)
    ));

    if (dueToday) {
      return ProblemIndexes.VERIFY_DUE_TODAY;
    }

    // check if there is failed verification
    const failed = actions.find(action => action.failedVerification());

    if (failed) {
      return ProblemIndexes.ACTIONS_FAILED_VERIFICATION;
    }

    return undefined;
  }

  _getActionCompletionStatus() {
    const workflowType = this._getWorkflowType();

    if ((workflowType === WorkflowTypes.SIX_STEP)
          && !this._analysisCompleted()) {
      return undefined;
    }

    // check if all actions are completed
    if (this._allActionsCompleted()) {
      return {
        [WorkflowTypes.THREE_STEP]: ProblemIndexes.CLOSED_ACTIONS_COMPLETED,
        [WorkflowTypes.SIX_STEP]: ProblemIndexes.ACTIONS_COMPLETED_WAITING_VERIFY,
      }[workflowType];
    }

    const actions = this._actions;
    const timezone = this._timezone;

    const uncompletedActions = actions.filter(action => !action.completed());

    // check if there is overduded action
    const overduded = uncompletedActions.find(action => (
      isOverdue(action.completionTargetDate, timezone)
    ));

    if (overduded) {
      return ProblemIndexes.ACTIONS_OVERDUE;
    }

    // check if there is an action that must completed today
    const dueToday = uncompletedActions.find(action => (
      isDueToday(action.completionTargetDate, timezone)
    ));

    if (dueToday) {
      return ProblemIndexes.ACTIONS_DUE_TODAY;
    }

    // check if there is at least one completed action
    if (this._completedActionsLength >= 1) {
      return {
        [WorkflowTypes.THREE_STEP]: ProblemIndexes.OPEN_ACTIONS_COMPLETED,
        [WorkflowTypes.SIX_STEP]: ProblemIndexes.ACTIONS_COMPLETED_WAITING_VERIFY,
      }[workflowType];
    }

    if ((workflowType === WorkflowTypes.THREE_STEP)
          && actions.length) {
      return ProblemIndexes.ACTIONS_IN_PLACE;
    }

    return undefined;
  }

  _getAnalysisStatus() {
    if (this._analysisCompleted()) {
      if (this._actions.length > 0) {
        return ProblemIndexes.ANALYSIS_COMPLETED_ACTIONS_IN_PLACE;
      }

      return ProblemIndexes.ANALYSIS_COMPLETED_ACTIONS_NEED;
    }

    const { analysis } = this._doc || {};
    const { targetDate } = analysis || {};
    const timezone = this._timezone;

    if (isOverdue(targetDate, timezone)) {
      return ProblemIndexes.ANALYSIS_OVERDUE;
    }

    if (isDueToday(targetDate, timezone)) {
      return ProblemIndexes.ANALYSIS_DUE_TODAY;
    }

    return undefined;
  }

  _onUpdateStatus(status) {
    const initiateApprovalProcess = () => {
      if (status === ProblemIndexes.ACTIONS_AWAITING_UPDATE) {
        const doc = this._doc || {};
        const organization = Organizations.findOne({ _id: doc.organizationId });
        const { _id } = doc;
        const docType = this.constructor._docType;

        if (doc.updateOfStandards && doc.updateOfStandards.executor) {
          return;
        }

        const targetDate = getWorkflowDefaultStepDate({
          organization,
          linkedTo: [{ documentId: _id, documentType: docType }],
        });
        let service;

        if (docType === ProblemTypes.RISK) {
          service = RiskService;
        } else {
          service = NonConformityService;
        }

        service.setStandardsUpdateExecutor({
          _id,
          executor: doc.originatorId,
          assignedBy: doc.originatorId,
        }, doc);
        service.setStandardsUpdateDate({
          _id,
          targetDate,
        }, doc);
      }
    };

    initiateApprovalProcess();
  }
}
