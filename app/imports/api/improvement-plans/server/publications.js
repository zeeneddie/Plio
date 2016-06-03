import { Meteor } from 'meteor/meteor';
import { ImprovementPlans } from '../improvement-plans.js';

Meteor.publish('improvementPlan', function(documentId) {
  if (this.userId) {
    return ImprovementPlans.find({ documentId });
  } else {
    return this.ready();
  }
});
