import { _ } from 'meteor/underscore';

import { CollectionNames } from '/imports/share/constants';
import { NonConformities } from '/imports/share/collections/non-conformities';
import ProblemAuditConfig from '../problems/problem-audit-config';
import NCWorkflow from '/imports/workflow/NCWorkflow';

import cost from './fields/cost.js';
import improvementPlanDesiredOutcome from './fields/improvementPlan.desiredOutcome';
import improvementPlanFileIds from './fields/improvementPlan.fileIds';
import improvementPlanOwner from './fields/improvementPlan.owner';
import improvementPlanReviewDatesDate from './fields/improvementPlan.reviewDates.date';
import improvementPlanReviewDates from './fields/improvementPlan.reviewDates';
import improvementPlanTargetDate from './fields/improvementPlan.targetDate';
import ref from './fields/ref';
import refText from './fields/ref.text';
import refUrl from './fields/ref.url';
import { getDocUrlByOrganizationId, getDocUnsubscribePath } from '/imports/helpers/url';

const generateNCDocUrl = getDocUrlByOrganizationId('non-conformities');

export default NCAuditConfig = Object.assign({}, ProblemAuditConfig, {

  collection: NonConformities,

  collectionName: CollectionNames.NCS,

  workflowConstructor: NCWorkflow,

  updateHandlers: [
    ...ProblemAuditConfig.updateHandlers,
    cost,
    improvementPlanDesiredOutcome,
    improvementPlanFileIds,
    improvementPlanOwner,
    improvementPlanReviewDatesDate,
    improvementPlanReviewDates,
    improvementPlanTargetDate,
    ref,
    refText,
    refUrl,
  ],

  docDescription() {
    return 'non-conformity';
  },

  docUrl: generateNCDocUrl,

  docUnsubscribeUrl: _.compose(getDocUnsubscribePath, generateNCDocUrl),

});
