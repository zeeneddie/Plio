import { Meteor } from 'meteor/meteor';
import property from 'lodash.property';
import get from 'lodash.get';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '../messages.js';
import { Files } from '/imports/api/files/files.js';
import { isOrgMember } from '../../checkers.js';
import { Match } from 'meteor/check';
import Counter from '../../counter/server.js';

Meteor.publishComposite('messages', function(discussionId, {
	limit = 50,
	sort = { createdAt: -1 },
	at = null
} = {}) {
	return {
		find() {
			if (at) {
				const msg = Object.assign({}, Messages.findOne({ _id: at }));
				const getMsgs = (initial = {}, direction = -1) => {
					const sign = direction > 0 ? '$gt' : '$lt';
					const query = {
						createdAt: { [sign]: get(initial, 'createdAt') }
					};
					const options = {
						limit: 25,
						sort: { createdAt: direction },
						fields: { _id: 1 }
					};
					return Messages.find(query, options);
				};
				const prior = getMsgs(msg, -1);
				const following = getMsgs(msg, 1);

				const msgs = [...prior.fetch(), msg, ...following.fetch()];
				const ids = msgs.map(property('_id'));

				return Messages.find({ _id: { $in: ids } }, { limit, sort });
			}

			return Messages.find({ discussionId }, { limit, sort });
		},
		children: [{
	  	find: function (message) {
	      return Meteor.users.find({ _id: message.userId }, { fields: { profile: 1 } });
	    }
	  }, {
	  	find: function (message) {
				if (message.fileId) {
	      	return Files.find({ _id: message.fileId });
				}
	    }
	  }]
	}
});

Meteor.publish('messagesLast', function(discussionId) {
	const discussion = Object.assign({}, Discussions.findOne({ _id: discussionId }));

	if (!this.userId || !isOrgMember(this.userId, get(discussion, 'organizationId'))) {
		return this.ready();
	}

	let lastMessageId;
	let initializing = true;

	const query = { discussionId };
	const options = { sort: { createdAt: -1 }, skip: 0, limit: 1 };

	const getLastMessageId = () => get(_.first(Messages.find(query, options).fetch()), '_id');

	const handle = Messages.find(query, { sort: options.sort }).observeChanges({
		added: (id) => {
			if (!initializing) {
				this.changed('lastMessage', discussionId, { lastMessageId: id });
			}
		},
		removed: (id) => {
			this.changed('lastMessage', discussionId, { lastMessageId: getLastMessageId() });
		}
	});

	initializing = false;

	this.added('lastMessage', discussionId, { lastMessageId: getLastMessageId() });

	this.ready();

	this.onStop(() => handle.stop());
});

// Meteor.publishComposite('messagesByDiscussionIds', function ({ discussionIds, organizationId }) {
// 	return {
// 		find() {
// 			const userId = this.userId;
// 			if (!userId || !isOrgMember(userId, organizationId)) {
// 		    return this.ready();
// 		  }
//
// 			return Messages.find({ organizationId, discussionId: { $in: discussionIds } });
// 		},
// 		children: [{
// 	  	find: function (message) {
// 	      return Meteor.users.find({ _id: message.userId }, { fields: { profile: 1 } });
// 	    }
// 	  }, {
// 	  	find: function (message) {
// 				if (message.fileId) {
// 	      	return Files.find({ _id: message.fileId });
// 				}
// 	    }
// 	  }]
// 	}
// });

// Unread messages by the logged in user, with info about users that created
// the messages.
Meteor.publishComposite('unreadMessages', function({ organizationId }) {
	return {
		find() {
			const userId = this.userId;

			if (!userId || !isOrgMember(userId, organizationId)) {
		    return this.ready();
		  }

			return Messages.find({ organizationId: organizationId, viewedBy: { $nin: [userId] } });
		},
		children: [{
	  	find: function (message) {
	      return Meteor.users.find({ _id: message.userId }, { fields: { profile: 1 } });
	    }
	  }, {
			find: function (message) {
				return Discussions.find({ _id: message.discussionId }, { fields: { linkedTo: 1, organizationId: 1 } });
			}
		}, {
	  	find: function (message) {
				if (message.fileId) {
	      	return Files.find({ _id: message.fileId });
				}
	    }
	  }]
	}
});

// Meteor.publish('messagesByDiscussionIds', function(arrDiscussionIds, params = { limit: 50 }) {
// 	const extractUserIds = (cursors, arrayOfIds = []) => {
// 		if (!!cursors && !Match.test(cursors, Array)) {
// 			cursors = [cursors];
// 		}
//
// 		_.each(cursors, (cursor) => {
// 			cursor.forEach((c, i, cr) => {
// 				if(arrayOfIds.indexOf(c.userId) < 0) {
// 					arrayOfIds.push(c.userId);
// 				}
// 			});
// 		});
//
// 		return arrayOfIds;
// 	};
//
// 	const extractMessageIds = (cursors, arrayOfIds = []) => {
// 		if (!!cursors && !Match.test(cursors, Array)) {
// 			cursors = [cursors];
// 		}
//
// 		_.each(cursors, (cursor) => {
// 			cursor.forEach((c, i, cr) => {
// 				if(arrayOfIds.indexOf(c._id) < 0) {
// 					arrayOfIds.push(c._id);
// 				}
// 			});
// 		});
// 		return arrayOfIds;
// 	};
//
// 	let messages;
//
// 	if (params.at) {
// 		const selectedMessage = Messages.findOne({ _id: params.at });
//
// 		const priorMessagesCursor = Messages.find({ discussionId: { $in: arrDiscussionIds }, createdAt: { $lte: selectedMessage.createdAt } }, { sort: { createdAt: -1 }, limit: 25, fields: { _id: 1 } });
// 		const followingMessagesCursor = Messages.find({ discussionId: { $in: arrDiscussionIds }, createdAt: { $gt: selectedMessage.createdAt } }, { sort: { createdAt: 1 }, limit: 25, fields: { _id: 1 } });
// 		const latestMessages = Messages.find({ discussionId: { $in: arrDiscussionIds } }, { sort: { createdAt: -1 }, limit: 25, fields: { _id: 1 } });
// 		const messageIds = extractMessageIds([latestMessages]);
// 		messages = Messages.find({ _id: { $in: messageIds } });
// 	} else {
// 		messages = Messages.find({ discussionId: { $in: arrDiscussionIds } }, { sort: { createdAt: -1 }, limit: params.limit });
// 	}
//
// 	const userIds = extractUserIds(messages);
//
// 	return [
// 		messages,
// 		Meteor.users.find({ _id: { $in: userIds } }, { fields: { profile: 1, emails: 1, roles: 1 } })
// 	];
// });

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
  }));
});
