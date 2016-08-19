import { Meteor } from 'meteor/meteor';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '../messages.js';
import { isOrgMember } from '../../checkers.js';
import { Match } from 'meteor/check';
import Counter from '../../counter/server.js';

Meteor.publish('messagesByDiscussionIds', function(arrDiscussionIds, params = { limit: 50 }) {
	const extractUserIds = (cursors, arrayOfIds = []) => {
		if (!!cursors && !Match.test(cursors, Array)) {
			cursors = [cursors];
		}

		_.each(cursors, (cursor) => {
			cursor.forEach((c, i, cr) => {
				if(arrayOfIds.indexOf(c.userId) < 0) {
					arrayOfIds.push(c.userId);
				}
			});
		});

		return arrayOfIds;
	};

	const extractMessageIds = (cursors, arrayOfIds = []) => {
		if (!!cursors && !Match.test(cursors, Array)) {
			cursors = [cursors];
		}

		_.each(cursors, (cursor) => {
			cursor.forEach((c, i, cr) => {
				if(arrayOfIds.indexOf(c._id) < 0) {
					arrayOfIds.push(c._id);
				}
			});
		});
		return arrayOfIds;
	};

	let messages;

	if (params.at) {
		const selectedMessage = Messages.findOne({ _id: params.at });

		const priorMessagesCursor = Messages.find({ discussionId: { $in: arrDiscussionIds }, createdAt: { $lte: selectedMessage.createdAt } }, { sort: { createdAt: -1 }, limit: 25, fields: { _id: 1 } });
		const followingMessagesCursor = Messages.find({ discussionId: { $in: arrDiscussionIds }, createdAt: { $gt: selectedMessage.createdAt } }, { sort: { createdAt: 1 }, limit: 25, fields: { _id: 1 } });
		const latestMessages = Messages.find({ discussionId: { $in: arrDiscussionIds } }, { sort: { createdAt: -1 }, limit: 25, fields: { _id: 1 } });
		const messageIds = extractMessageIds([latestMessages]);
		messages = Messages.find({ _id: { $in: messageIds } });
	} else {
		messages = Messages.find({ discussionId: { $in: arrDiscussionIds } }, { sort: { createdAt: -1 }, limit: params.limit });
	}

	const userIds = extractUserIds(messages);

	return [
		messages,
		Meteor.users.find({ _id: { $in: userIds } }, { fields: { profile: 1, emails: 1, roles: 1 } })
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
