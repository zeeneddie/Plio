import { Meteor } from 'meteor/meteor';
import { ImprovementPlans } from '../improvement-plans.js';
import { isOrgMember } from '../../checkers.js';


Meteor.publish('improvementPlan', function(documentId, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return ImprovementPlans.find({ documentId });
});
