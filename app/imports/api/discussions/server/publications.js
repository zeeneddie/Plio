import { Meteor } from 'meteor/meteor';

import { Discussions } from '/imports/share/collections/discussions.js';
import { isOrgMember } from '../../checkers.js';

Meteor.publish('discussionsByDocId', function ({ docId, organizationId }) {
  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const query = { linkedTo: docId, organizationId };
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
