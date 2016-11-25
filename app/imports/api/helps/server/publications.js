import { Meteor } from 'meteor/meteor';

import { Helps } from '/imports/share/collections/helps';
import { isOrgMember } from '../../checkers.js';


Meteor.publish('helps', function publishHelps(organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return Helps.find({ organizationId });
});
