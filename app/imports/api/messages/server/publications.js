import { Meteor } from 'meteor/meteor';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '../messages.js';
import { Files } from '/imports/api/files/files.js';
import { isOrgMember } from '../../checkers.js';
import Counter from '../../counter/server.js';

Meteor.publishComposite('messagesByDiscussionIds', function (arrDiscussionIds) {
	return {
		find() {
			return Messages.find({ discussionId: { $in: arrDiscussionIds } });
		},
		children: [{
	  	find: function (message) {
	      return Meteor.users.find({ _id: message.userId });
	    }
	  }, {
	  	find: function (message) {
				if (message.fileIds && message.fileIds.length) {
	      	return Files.find({ _id: { $in: message.fileIds } });
				}
	    }
	  }]
	}
});

Meteor.publish('messagesByDiscussionIds2', function(arrDiscussionIds){
	let userIds = [];
	let fileIds = [];
	const messages = Messages.find({ discussionId: {$in: arrDiscussionIds} });

	messages.forEach((c, i, cr) => {
		if (userIds.indexOf(c.userId) < 0) {
			userIds.push(c.userId);
		}
		if (c.fileIds && c.fileIds.length) {
			fileIds = _.union(fileIds, c.fileIds);
		}
	});

	return [
		messages,
		Meteor.users.find({ _id: { $in: userIds } }, { fields: { profile: 1 } }),
		Files.find({ _id: { $in: fileIds } })
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
