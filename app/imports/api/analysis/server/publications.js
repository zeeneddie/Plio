import { Meteor } from 'meteor/meteor';
import { Analysis } from '../analysis.js';
import { NonConformities } from '../../non-conformities/non-conformities.js';
import { isOrgMember } from '../../checkers.js';


Meteor.publish('analysis', function(nonConformityId) {
  const userId = this.userId;
  if (!userId) {
    return this.ready();
  }

  const nonConformity = NonConformities.findOne({ _id: nonConformityId });
  const organizationId = nonConformity && nonConformity.organizationId;

  if (!isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return Analysis.find({ nonConformityId });
});
