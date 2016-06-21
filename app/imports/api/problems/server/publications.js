import { Meteor } from 'meteor/meteor';
import { Problems } from '../problems.js';
import { isOrgMember } from '../../checkers.js';

import Counter from '../../counter/server.js';


Meteor.publish('problems', function(organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return Problems.find({ organizationId, isDeleted: { $in: [false, null] } });
});
