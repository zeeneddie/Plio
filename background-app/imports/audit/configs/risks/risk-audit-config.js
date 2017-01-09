import { _ } from 'meteor/underscore';

import { Risks } from '/imports/share/collections/risks';
import { CollectionNames } from '/imports/share/constants';
import ProblemAuditConfig from '../problems/problem-audit-config';
import RiskWorkflow from '/imports/workflow/RiskWorkflow';

import improvementPlanDesiredOutcome from './fields/improvementPlan.desiredOutcome';
import improvementPlanFileIds from './fields/improvementPlan.fileIds';
import improvementPlanOwner from './fields/improvementPlan.owner';
import improvementPlanReviewDatesDate from './fields/improvementPlan.reviewDates.date';
import improvementPlanReviewDates from './fields/improvementPlan.reviewDates';
import improvementPlanTargetDate from './fields/improvementPlan.targetDate';
import reviewComments from './fields/review.comments';
import reviewReviewedAt from './fields/review.reviewedAt';
import reviewReviewedBy from './fields/review.reviewedBy';
import riskEvaluationComments from './fields/riskEvaluation.comments';
import riskEvaluationDecision from './fields/riskEvaluation.decision';
import riskEvaluationPrevLossExp from './fields/riskEvaluation.prevLossExp';
import riskEvaluationPriority from './fields/riskEvaluation.priority';
import scores from './fields/scores';
import typeId from './fields/typeId';
import { getDocUrlByOrganizationId, getDocUnsubscribePath } from '/imports/helpers/url';

const generateRiskDocUrl = getDocUrlByOrganizationId('risks');

export default RiskAuditConfig = _.extend({}, ProblemAuditConfig, {

  collection: Risks,

  collectionName: CollectionNames.RISKS,

  workflowConstructor: RiskWorkflow,

  updateHandlers: [
    ...ProblemAuditConfig.updateHandlers,
    improvementPlanDesiredOutcome,
    improvementPlanFileIds,
    improvementPlanOwner,
    improvementPlanReviewDatesDate,
    improvementPlanReviewDates,
    improvementPlanTargetDate,
    reviewComments,
    reviewReviewedAt,
    reviewReviewedBy,
    riskEvaluationComments,
    riskEvaluationDecision,
    riskEvaluationPrevLossExp,
    riskEvaluationPriority,
    scores,
    typeId,
  ],

  docDescription() {
    return 'risk';
  },

  docUrl: generateRiskDocUrl,

  docUnsubscribeUrl: _.compose(getDocUnsubscribePath, generateRiskDocUrl),
});
