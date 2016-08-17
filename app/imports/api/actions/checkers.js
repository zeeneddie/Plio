import { NonConformities } from '../non-conformities/non-conformities.js';
import { Risks } from '../risks/risks.js';
import { Actions } from './actions.js';
import { ProblemTypes, ActionTypes, WorkflowTypes } from '../constants.js';
import { checkAndThrow } from '../helpers.js';
import { isOrgOwner, checkDocAndMembership, checkDocAndMembershipAndMore } from '../checkers.js';
import {
  INVALID_DOC_TYPE,
  DOC_NOT_FOUND,
  ONLY_OWNER_CAN_DELETE,
  ONLY_ORG_OWNER_CAN_DELETE,
  ONLY_OWNER_CAN_RESTORE,
  ONLY_ORG_OWNER_CAN_RESTORE,
  ACT_RK_CANNOT_BE_LINKED_TO_NC,
  ACT_PA_CANNOT_BE_LINKED_TO_RISK,
  ACT_ALREADY_LINKED,
  ACT_CANNOT_COMPLETE,
  ACT_COMPLETION_CANNOT_BE_UNDONE,
  ACT_CANNOT_VERIFY,
  ACT_VERIFICATION_CANNOT_BE_UNDONE
} from '../errors.js';

export const ACT_Check = function ACT_Check(_id) {
  return checkDocAndMembership(Actions, _id, this.userId);
};

export const ACT_CheckEverything = function ACT_CheckEverything(_id) {
  return checkDocAndMembershipAndMore(Actions, _id, this.userId);
};

export const ACT_LinkedDocsChecker = (linkedTo) => {
  const linkedToByType = _.groupBy(linkedTo, doc => doc.documentType);

  const NCsIds = _.pluck(linkedToByType[ProblemTypes.NC], 'documentId');
  const risksIds = _.pluck(linkedToByType[ProblemTypes.RISK], 'documentId');

  const docWithUncompletedAnalysis = NonConformities.findOne({
    _id: { $in: NCsIds },
    workflowType: WorkflowTypes.SIX_STEP,
    'analysis.status': 0 // Not completed
  }) || Risks.findOne({
    _id: { $in: risksIds },
    workflowType: WorkflowTypes.SIX_STEP,
    'analysis.status': 0 // Not completed
  });

  if (docWithUncompletedAnalysis) {
    const { sequentialId, title } = docWithUncompletedAnalysis;
    throw new Meteor.Error(
      400,
      `Root cause analysis for ${sequentialId} "${title}" must be completed first`
    );
  }
};

export const ACT_OnLinkChecker = ({ documentId, documentType }, action) => {
  const collection = ((() => {
    if (Object.is(documentType, ProblemTypes.NC)) {
      if (Object.is(action.type, ActionTypes.RISK_CONTROL)) {
        throw ACT_RK_CANNOT_BE_LINKED_TO_NC;
      }

      return NonConformities;
    } else if (Object.is(documentType, ProblemTypes.RISK)) {
      if (Object.is(action.type, ActionTypes.PREVENTATIVE_ACTION)) {
        throw ACT_PA_CANNOT_BE_LINKED_TO_RISK;
      }

      return Risks;
    }
  })());

  checkAndThrow(!collection, INVALID_DOC_TYPE);

  const doc = collection.findOne({ _id: documentId });

  checkAndThrow(!doc, DOC_NOT_FOUND);

  checkAndThrow(action.isLinkedToDocument(), ACT_ALREADY_LINKED);

  ACT_LinkedDocsChecker([{ documentId, documentType }]);

  return {
    doc,
    collection,
    action
  };
};

export const ACT_OnCompleteChecker = ({ userId }, action) => {
  checkAndThrow(userId !== action.toBeCompletedBy, ACT_CANNOT_COMPLETE);

  checkAndThrow(!action.canBeCompleted(), ACT_CANNOT_COMPLETE);

  return { action };
};

export const ACT_OnUndoCompletionChecker = ({ userId }, action) => {
  checkAndThrow(userId !== action.completedBy, ACT_COMPLETION_CANNOT_BE_UNDONE);

  checkAndThrow(!action.canCompletionBeUndone(), ACT_COMPLETION_CANNOT_BE_UNDONE);

  return { action };
};

export const ACT_OnVerifyChecker = ({ userId }, action) => {
  checkAndThrow(userId !== action.toBeVerifiedBy, ACT_CANNOT_VERIFY);

  checkAndThrow(!action.canBeVerified(), ACT_CANNOT_VERIFY);

  return { action };
};

export const ACT_OnUndoVerificationChecker = ({ userId }, action) => {
  checkAndThrow(!Object.is(userId, action.verifiedBy), ACT_VERIFICATION_CANNOT_BE_UNDONE);

  checkAndThrow(!action.canVerificationBeUndone(), ACT_VERIFICATION_CANNOT_BE_UNDONE);

  return { action };
};

export const ACT_OnRemoveChecker = ({ userId }, action) => {
  const currentAssignee = action.verified() ? action.toBeVerifiedBy : action.toBeCompletedBy;
  const isUserOrgOwner = isOrgOwner(userId, action.organizationId);
  const predicate = !isUserOrgOwner || !Object.is(userId, currentAssignee);

  checkAndThrow(predicate, ONLY_OWNER_CAN_DELETE);

  checkAndThrow(action.isDeleted && !isUserOrgOwner, ONLY_ORG_OWNER_CAN_DELETE);

  return { action };
};

export const ACT_OnRestoreChecker = ({ userId }, action) => {
  ACT_OnRemoveChecker({ userId }, action);

  checkAndThrow(!action.isDeleted, CANNOT_RESTORE_NOT_DELETED);
};
