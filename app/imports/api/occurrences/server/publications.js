import { Meteor } from 'meteor/meteor';
import { Occurrences } from '../occurrences.js';
import { isOrgMember } from '../../checkers.js';


Meteor.publish('occurrences', function(nonConformityId, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return Occurrences.find({ nonConformityId });
});

Meteor.publish('occurrencesByNCIds', function(ids, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return Occurrences.find({ nonConformityId: { $in: ids } });
});
