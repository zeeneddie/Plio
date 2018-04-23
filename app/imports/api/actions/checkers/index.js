/* eslint-disable camelcase */

import { _ } from 'meteor/underscore';

import { Risks, NonConformities, Goals } from '../../../share/collections';
import { ProblemTypes, ActionTypes, WorkflowTypes, DocumentTypes } from '../../../share/constants';
import { AnalysisTitles } from '../../constants';
import { checkAndThrow } from '../../helpers';
import { capitalize } from '../../../share/helpers';

import {
  INVALID_DOC_TYPE,
  DOC_NOT_FOUND,
  ACT_RK_CANNOT_BE_LINKED_TO_NC,
  ACT_ALREADY_LINKED,
  ACT_ANALYSIS_MUST_BE_COMPLETED,
} from '../../errors';

export { default as canBeCompleted } from './canBeCompleted';
export { default as canBeVerified } from './canBeVerified';
export { default as canCompletionBeUndone } from './canCompletionBeUndone';
export { default as canCompleteAny } from './canCompleteAny';
export { default as isUndoDeadlineDue } from './isUndoDeadlineDue';
export { default as isCompletedAtDeadlineDue } from './isCompletedAtDeadlineDue';
export { default as isVerifiedAtDeadlineDue } from './isVerifiedAtDeadlineDue';
export { default as canVerificationBeUndone } from './canVerificationBeUndone';

export const ACT_LinkedDocsChecker = (linkedTo) => {
  const linkedToByType = _.groupBy(linkedTo, doc => doc.documentType);

  const NCsIds = _.pluck(linkedToByType[ProblemTypes.NON_CONFORMITY], 'documentId');
  const PGsIds = _.pluck(linkedToByType[ProblemTypes.POTENTIAL_GAIN], 'documentId');
  const risksIds = _.pluck(linkedToByType[ProblemTypes.RISK], 'documentId');

  let docWithUncompletedAnalysis;
  let analysisTitle;

  docWithUncompletedAnalysis = Risks.findOne({
    _id: { $in: risksIds },
    workflowType: WorkflowTypes.SIX_STEP,
    'analysis.status': 0, // Not completed
  });

  if (docWithUncompletedAnalysis) {
    analysisTitle = AnalysisTitles.riskAnalysis;
  } else {
    docWithUncompletedAnalysis = NonConformities.findOne({
      _id: { $in: [...NCsIds, ...PGsIds] },
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
    switch (documentType) {
      case ProblemTypes.NON_CONFORMITY:
      case ProblemTypes.POTENTIAL_GAIN: {
        if (action.type === ActionTypes.RISK_CONTROL) {
          throw ACT_RK_CANNOT_BE_LINKED_TO_NC;
        }

        return NonConformities;
      }
      case ProblemTypes.RISK:
        return Risks;
      case DocumentTypes.GOAL:
        return Goals;
      default:
        return undefined;
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
