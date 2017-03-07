import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Departments } from '/imports/share/collections/departments';
import { isOrgMember } from '../../checkers';


Meteor.publish('departments', function (organizationId) {
  check(organizationId, String);

  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return Departments.find({ organizationId });
});
