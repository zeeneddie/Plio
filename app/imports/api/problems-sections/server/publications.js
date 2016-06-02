import { Meteor } from 'meteor/meteor';
import { ProblemsSections } from '../problems-sections.js';


Meteor.publish('risks-sections', function(organizationId) {
  if (this.userId) {
    return ProblemsSections.find({ organizationId });
  } else {
    return this.ready();
  }
});
