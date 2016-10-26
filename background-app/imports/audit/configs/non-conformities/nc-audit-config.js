import { Meteor } from 'meteor/meteor';

import { CollectionNames } from '/imports/share/constants.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Organizations } from '/imports/share/collections/organizations.js';
import ProblemAuditConfig from '../problems/problem-audit-config.js';
import NCWorkflow from '/imports/workflow/NCWorkflow.js';

import cost from './fields/cost.js';
import improvementPlanDesiredOutcome from './fields/improvementPlan.desiredOutcome.js';
import improvementPlanFileIds from './fields/improvementPlan.fileIds.js';
import improvementPlanOwner from './fields/improvementPlan.owner.js';
import improvementPlanReviewDatesDate from './fields/improvementPlan.reviewDates.date.js';
import improvementPlanReviewDates from './fields/improvementPlan.reviewDates.js';
import improvementPlanTargetDate from './fields/improvementPlan.targetDate.js';
import ref from './fields/ref.js';
import refText from './fields/ref.text.js';
import refUrl from './fields/ref.url.js';


export default NCAuditConfig = _.extend({}, ProblemAuditConfig, {

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
    refUrl
  ],

  docDescription(doc) {
    return 'non-conformity';
  },

  docUrl({ _id, organizationId }) {
    const { serialNumber } = Organizations.findOne({ _id: organizationId });
    return Meteor.absoluteUrl(`${serialNumber}/non-conformities/${_id}`, {
      rootUrl: Meteor.settings.mainApp.url
    });
  }

});
