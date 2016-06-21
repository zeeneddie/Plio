import { Meteor } from 'meteor/meteor';
import { ImprovementPlans } from '../improvement-plans.js';
import { isOrgMember } from '../../checkers.js';


Meteor.publish('improvementPlan', function(documentId) {
  const userId = this.userId;
  if (!userId) {
    return this.ready();
  }

  const improvementPlan = ImprovementPlans.find({ documentId });
  const document = improvementPlan.count() && improvementPlan.fetch()[0].relatedDocument();
  const organizationId = document && document.organizationId;

  if (!isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return improvementPlan;
});
