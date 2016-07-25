import { Meteor } from 'meteor/meteor';
import { WorkItems } from '../work-items.js';
import { isOrgMember } from '../../checkers.js';

Meteor.publish('workItems', function(organizationId, isDeleted = { $in: [null, false] }) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return WorkItems.find({ organizationId, isDeleted });
});
