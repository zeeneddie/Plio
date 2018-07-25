import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { RiskTypes } from '/imports/share/collections/risk-types.js';
import { isOrgMember } from '../../checkers';


Meteor.publish('riskTypes', function (organizationId) {
  check(organizationId, String);

  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return RiskTypes.find({ organizationId });
});
