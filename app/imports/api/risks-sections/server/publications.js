import { Meteor } from 'meteor/meteor';
import { RisksSections } from '../risks-sections.js';
import { isOrgMember } from '../../checkers.js';


Meteor.publish('risks-sections', function(organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return RisksSections.find({ organizationId });
});
