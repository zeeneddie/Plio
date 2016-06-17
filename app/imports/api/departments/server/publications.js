import { Meteor } from 'meteor/meteor';
import { Departments } from '../departments.js';
import { isOrgMember } from '../../checkers.js';


Meteor.publish('departments', function(organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return Departments.find({ organizationId });
});
