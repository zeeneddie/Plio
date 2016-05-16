import { Meteor } from 'meteor/meteor';
import { ImprovementPlans } from '../improvement-plans.js';

Meteor.publish('improvementPlan', function(standardId) {
  if (this.userId) {
    return ImprovementPlans.find({ standardId });
  } else {
    return this.ready();
  }
});
