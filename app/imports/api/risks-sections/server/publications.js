import { Meteor } from 'meteor/meteor';
import { RisksSections } from '../risks-sections.js';


Meteor.publish('risks-sections', function(organizationId) {
  if (this.userId) {
    return RisksSections.find({ organizationId });
  } else {
    return this.ready();
  }
});
