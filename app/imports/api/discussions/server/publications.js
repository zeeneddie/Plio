import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Discussions } from '/imports/share/collections/discussions';
import { isOrgMember } from '../../checkers';

Meteor.publish('discussionsByDocId', function ({ docId, organizationId }) {
  check(docId, String);
  check(organizationId, String);

  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const query = { organizationId, linkedTo: docId };
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
      viewedBy: { $elemMatch: { userId } },
      mutedBy: userId,
    },
  };

  return Discussions.find(query, options);
});
