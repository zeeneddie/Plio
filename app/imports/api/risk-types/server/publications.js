import { Meteor } from 'meteor/meteor';
import { RiskTypes } from '../risk-types.js';
import { isOrgMember } from '../../checkers.js';


Meteor.publish('riskTypes', function(organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return RiskTypes.find({ organizationId });
});
