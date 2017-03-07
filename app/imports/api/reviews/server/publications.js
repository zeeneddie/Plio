import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Reviews } from '/imports/share/collections/reviews';
import { isOrgMember } from '../../checkers';


Meteor.publish('reviews', function (organizationId) {
  check(organizationId, String);

  if (!this.userId || !isOrgMember(this.userId, organizationId)) {
    return this.ready();
  }

  return Reviews.find({ organizationId });
});
