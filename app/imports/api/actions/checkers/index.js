import { NonConformities } from '../../../share/collections/non-conformities';
import { Risks } from '../../../share/collections/risks';
import { Actions } from '../../../share/collections/actions';
import { ProblemTypes, ActionTypes, WorkflowTypes } from '../../../share/constants';
import { AnalysisTitles } from '../../constants';
import { checkAndThrow } from '../../helpers';
import { capitalize } from '../../../share/helpers';

import { checkDocAndMembership, checkDocAndMembershipAndMore } from '../../checkers';
import {
  INVALID_DOC_TYPE,
  DOC_NOT_FOUND,
  ACT_RK_CANNOT_BE_LINKED_TO_NC,
  ACT_ALREADY_LINKED,
  ACT_CANNOT_COMPLETE,
  ACT_COMPLETION_CANNOT_BE_UNDONE,
  ACT_CANNOT_VERIFY,
  ACT_VERIFICATION_CANNOT_BE_UNDONE,
  ACT_ANALYSIS_MUST_BE_COMPLETED,
} from '../../errors';
import { canCompleteActions } from '../../checkers/roles';
import canBeCompleted from './canBeCompleted';

export { default as canBeCompleted } from './canBeCompleted';
export { default as canBeVerified } from './canBeVerified';
export { default as canCompletionBeUndone } from './canCompletionBeUndone';
export { default as hasRoleToComplete } from './hasRoleToComplete';
export { default as isDeadlinePassed } from './isDeadlinePassed';
export { default as isCompletedAtDeadlinePassed } from './isCompletedAtDeadlinePassed';
export { default as isVerifiedAtDeadlinePassed } from './isVerifiedAtDeadlinePassed';
export { default as canVerificationBeUndone } from './canVerificationBeUndone';

export const ACT_Check = function ACT_Check(_id) {
  return checkDocAndMembership(Actions, _id, this.userId);
};

export const ACT_CheckEverything = function ACT_CheckEverything(_id) {
  return checkDocAndMembershipAndMore(Actions, _id, this.userId);
};

export const ACT_LinkedDocsChecker = (linkedTo) => {
  const linkedToByType = _.groupBy(linkedTo, doc => doc.documentType);

  const NCsIds = _.pluck(linkedToByType[ProblemTypes.NON_CONFORMITY], 'documentId');
  const risksIds = _.pluck(linkedToByType[ProblemTypes.RISK], 'documentId');

  let docWithUncompletedAnalysis,
    analysisTitle;

  docWithUncompletedAnalysis = Risks.findOne({
    _id: { $in: risksIds },
    workflowType: WorkflowTypes.SIX_STEP,
    'analysis.status': 0, // Not completed
  });

  if (docWithUncompletedAnalysis) {
    analysisTitle = AnalysisTitles.riskAnalysis;
  } else {
    docWithUncompletedAnalysis = NonConformities.findOne({
      _id: { $in: NCsIds },
      workflowType: WorkflowTypes.SIX_STEP,
      'analysis.status': 0, // Not completed
    });
    analysisTitle = docWithUncompletedAnalysis &&
      docWithUncompletedAnalysis.type === ProblemTypes.POTENTIAL_GAIN
      ? AnalysisTitles.potentialGainAnalysis
      : AnalysisTitles.rootCauseAnalysis;
  }


  if (docWithUncompletedAnalysis) {
    const { sequentialId, title } = docWithUncompletedAnalysis;

    analysisTitle = capitalize(analysisTitle.replace('Complete ', ''));

    throw ACT_ANALYSIS_MUST_BE_COMPLETED(title, sequentialId, analysisTitle);
  }
};


export const ACT_OnLinkChecker = ({ documentId, documentType }, action) => {
  const collection = ((() => {
    if (Object.is(documentType, ProblemTypes.NON_CONFORMITY)) {
      if (Object.is(action.type, ActionTypes.RISK_CONTROL)) {
        throw ACT_RK_CANNOT_BE_LINKED_TO_NC;
      }

      return NonConformities;
    } else if (Object.is(documentType, ProblemTypes.RISK)) {
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
    action,
  };
};

export const ACT_OnCompleteChecker = ({ userId }, action) => {
  const { organizationId, toBeCompletedBy } = action;

  checkAndThrow(
    !canBeCompleted({ organizationId, toBeCompletedBy }, userId),
    ACT_CANNOT_COMPLETE,
  );

  return { action };
};

export const ACT_OnUndoCompletionChecker = ({ userId }, action) => {
  checkAndThrow(userId !== action.completedBy, ACT_COMPLETION_CANNOT_BE_UNDONE);

  checkAndThrow(!action.canCompletionBeUndone(), ACT_COMPLETION_CANNOT_BE_UNDONE);

  checkAndThrow(
    !canCompleteActions(userId, action.organizationId),
    ACT_COMPLETE_NO_PERMISSION,
  );

  return { action };
};

export const ACT_OnVerifyChecker = ({ userId }, action) => {
  checkAndThrow(userId !== action.toBeVerifiedBy, ACT_CANNOT_VERIFY);

  checkAndThrow(!action.canBeVerified(), ACT_CANNOT_VERIFY);

  checkAndThrow(
    !canCompleteActions(userId, action.organizationId),
    ACT_COMPLETE_NO_PERMISSION,
  );

  return { action };
};

export const ACT_OnUndoVerificationChecker = ({ userId }, action) => {
  checkAndThrow(!Object.is(userId, action.verifiedBy), ACT_VERIFICATION_CANNOT_BE_UNDONE);

  checkAndThrow(!action.canVerificationBeUndone(), ACT_VERIFICATION_CANNOT_BE_UNDONE);

  checkAndThrow(
    !canCompleteActions(userId, action.organizationId),
    ACT_COMPLETE_NO_PERMISSION,
  );

  return { action };
};
