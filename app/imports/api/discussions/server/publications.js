import { Meteor } from 'meteor/meteor';
import get from 'lodash.get';

import { Discussions } from '/imports/share/collections/discussions.js';
import { Standards } from '/imports/share/collections/standards.js'
import { isOrgMember } from '../../checkers.js';

Meteor.publish('discussionsByStandardId', function(standardId) {
  const userId = this.userId;
  const standard = Standards.findOne({ _id: standardId });

  if (standard && !userId || !isOrgMember(userId, get(standard, 'organizationId'))) {
    return this.ready();
  }

  const query = { documentType: 'standard', linkedTo: standardId };
  const options = {
    fields: {
      _id: 1,
      documentType: 1,
      linkedTo: 1,
      isStarted: 1,
      startedAt: 1,
      startedBy: 1,
      isPrimary: 1,
      organizationId: 1,
      viewedBy: 1
    }
  };

  return Discussions.find(query, options);
});
