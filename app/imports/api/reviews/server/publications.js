import { Meteor } from 'meteor/meteor';

import { Reviews } from '/imports/share/collections/reviews';
import { isOrgMember } from '../../checkers';


Meteor.publish('reviews', function (organizationId) {
  if (!this.userId || !isOrgMember(this.userId, organizationId)) {
    return this.ready();
  }

  return Reviews.find({ organizationId });
});
