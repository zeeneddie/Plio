import { Meteor } from 'meteor/meteor';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '../messages.js';
import { isOrgMember } from '../../checkers.js';
import Counter from '../../counter/server.js';

Meteor.publish('messagesByDiscussionIds', function(arrDiscussionIds){
	const userIds = [];
	const messages = Messages.find({ discussionId: {$in: arrDiscussionIds} });

	messages.forEach((c, i, cr) => {
		if(userIds.indexOf(c.userId) < 0) {
			userIds.push(c.userId);
		}
	});

	return [
		messages,
		Meteor.users.find({ _id: { $in: userIds } }, { fields: { profile: 1 } })
	];
});

Meteor.publish('messagesNotViewedCount', function(counterName, documentId) {
  const userId = this.userId;
	const discussion = Discussions.findOne({ linkedTo: documentId, isPrimary: true });
	const discussionId = discussion && discussion._id;

	if (!discussionId || !userId || !isOrgMember(userId, discussion.organizationId)) {
    return this.ready();
  }
  return new Counter(counterName, Messages.find({
    discussionId,
		viewedBy: { $ne: userId }
		// viewedBy: { $ne: this.userId }
  }));
});
