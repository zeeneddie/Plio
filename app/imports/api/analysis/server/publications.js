import { Meteor } from 'meteor/meteor';
import { Analysis } from '../analysis.js';
import { isOrgMember } from '../../checkers.js';


Meteor.publish('analysis', function(nonConformityId, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return Analysis.find({ nonConformityId });
});
