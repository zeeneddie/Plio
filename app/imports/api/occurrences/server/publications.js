import { Meteor } from 'meteor/meteor';
import { Occurrences } from '../occurrences.js';
import { NonConformities } from '../../non-conformities/non-conformities.js';
import { isOrgMember } from '../../checkers.js';


Meteor.publish('occurrences', function(nonConformityId) {
  const userId = this.userId;
  if (!userId) {
    return this.ready();
  }

  const nonConformity = NonConformities.findOne({ _id: nonConformityId });
  const organizationId = nonConformity && nonConformity.organizationId;

  if (!isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return Occurrences.find({ nonConformityId });
});

Meteor.publish('occurrencesByNCIds', function(ids) {
  const userId = this.userId;
  if (!userId) {
    return this.ready();
  }

  const nonConformities = NonConformities.find({ _id: { $in: ids } });

  const NCIds = [];
  const allowedOrgIds = [];
  const deniedOrgIds = [];

  nonConformities.forEach((nc) => {
    const { _id, organizationId } = nc;

    if (_.contains(allowedOrgIds, organizationId)) {
      NCIds.push(_id);
      return;
    }

    if (_.contains(deniedOrgIds, organizationId)) {
      return;
    }

    if (isOrgMember(userId, organizationId)) {
      allowedOrgIds.push(organizationId);
      NCIds.push(_id);
    } else {
      deniedOrgIds.push(organizationId);
    }
  });

  return Occurrences.find({ nonConformityId: { $in: NCIds } });
});
