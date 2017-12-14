import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { StandardTypes } from '/imports/share/collections/standards-types.js';
import { isOrgMember } from '../../checkers';


Meteor.publish('standards-types', function (organizationId) {
  check(organizationId, String);

  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return StandardTypes.find({ organizationId });
});
