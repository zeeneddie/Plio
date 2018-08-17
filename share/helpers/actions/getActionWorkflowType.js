import { filterBy } from 'plio-util';
import { pluck } from 'ramda';

import { ActionTypes, WorkflowTypes, ProblemTypes } from '../../constants';
import { NonConformities, Risks } from '../../collections';

export default ({ type, linkedTo }) => {
  // Action has 6-step workflow if at least one linked document has 6-step workflow
  if (!linkedTo ||
      !linkedTo.length ||
      ![ActionTypes.CORRECTIVE_ACTION, ActionTypes.PREVENTATIVE_ACTION].includes(type)) {
    return WorkflowTypes.THREE_STEP;
  }

  const query = {
    isDeleted: false,
    deletedAt: { $exists: false },
    deletedBy: { $exists: false },
    workflowType: WorkflowTypes.SIX_STEP,
  };
  const docs = filterBy('documentType', [ProblemTypes.NON_CONFORMITY, ProblemTypes.RISK], linkedTo);
  const ids = pluck('documentId', docs);
  const problemsQuery = Object.assign({ _id: { $in: ids } }, query);
  const sixStepDoc = NonConformities.findOne(problemsQuery) || Risks.findOne(problemsQuery);

  return sixStepDoc ? WorkflowTypes.SIX_STEP : WorkflowTypes.THREE_STEP;
};
