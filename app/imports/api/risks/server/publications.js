import { Meteor } from 'meteor/meteor';
import { Risks } from '../risks.js';
import { isOrgMember } from '../../checkers.js';

import Counter from '../../counter/server.js';


Meteor.publish('risks', function(organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return Risks.find({ organizationId, isDeleted: { $in: [false, null] } });
});
