import { NonConformities } from '../non-conformities/non-conformities.js';
import { Risks } from '../risks/risks.js';
import { ProblemTypes, ActionTypes, WorkflowTypes } from '../constants.js';
import {
  ACT_RK_CANNOT_BE_LINKED_TO_NC,
  ACT_PA_CANNOT_BE_LINKED_TO_RISK,
  ACT_ALREADY_LINKED,
  INVALID_DOC_TYPE,
  DOC_NOT_FOUND
} from '../errors.js';

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

export const ACT_OnLinkChecker = (action, { documentId, documentType }) => {
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

  if (!collection) throw INVALID_DOC_TYPE;

  const doc = collection.findOne({ _id: documentId });

  if (!doc) throw DOC_NOT_FOUND;

  if (ACT_LinkedDocsChecker([{ documentId, documentType }])) throw ACT_ALREADY_LINKED;

  return {
    doc,
    collection,
    action
  };
}
