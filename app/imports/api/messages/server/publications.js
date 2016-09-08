import { Meteor } from 'meteor/meteor';
import property from 'lodash.property';
import get from 'lodash.get';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '../messages.js';
import { Files } from '/imports/api/files/files.js';
import { isOrgMember } from '../../checkers.js';
import { getJoinUserToOrganizationDate } from '/imports/api/organizations/utils.js';
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

	let initializing = true;

	const query = { discussionId };
	const options = { sort: { createdAt: -1 }, limit: 1, fields: { _id: 1 } };

	const getLastMessageId = () => ({
		lastMessageId: get(Messages.findOne(query, _.omit(options, 'limit')), '_id')
	});

	const handle = Messages.find(query, options).observeChanges({
		added: (id) => {
			if (!initializing) {
				this.changed('lastMessage', discussionId, { lastMessageId: id });
			}
		},
		removed: (id) => {
			if (!initializing) {
				this.changed('lastMessage', discussionId, getLastMessageId());
			}
		}
	});

	initializing = false;

	this.added('lastMessage', discussionId, getLastMessageId());

	this.ready();

	this.onStop(() => handle.stop());
});

// Unread messages by the logged in user, with info about users that created
// the messages.
Meteor.publishComposite('unreadMessages', function({ organizationId, limit }) {
	return {
		find() {
			const userId = this.userId;

			if (!userId || !isOrgMember(userId, organizationId)) {
		    return this.ready();
		  }

			const options = {};

			// Check if limit is an integer number
		  if (Number(limit) === limit && limit % 1 === 0) {
		    options.limit = limit;
		  }

			const currentOrgUserJoinedAt = getJoinUserToOrganizationDate({
		    organizationId, userId
		  });

			return Messages.find({
				organizationId: organizationId,
				viewedBy: { $nin: [userId] },
				createdAt: { $gte: currentOrgUserJoinedAt }
			}, options);
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

Meteor.publish('messagesNotViewedCount', function(counterName, documentId) {
  const userId = this.userId;
	const discussion = Discussions.findOne({ linkedTo: documentId, isPrimary: true });
	const discussionId = discussion && discussion._id;
	const organizationId = discussion.organizationId;

	if (!discussionId || !userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

	const currentOrgUserJoinedAt = getJoinUserToOrganizationDate({
		organizationId, userId
	});

  return new Counter(counterName, Messages.find({
    discussionId,
		organizationId,
		createdAt: { $gte: currentOrgUserJoinedAt },
		viewedBy: { $ne: userId }
  }));
});

Meteor.publish('messagesNotViewedCountTotal', function(counterName, organizationId) {
  const userId = this.userId;

	if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

	const currentOrgUserJoinedAt = getJoinUserToOrganizationDate({
		organizationId, userId
	});

  return new Counter(counterName, Messages.find({
		organizationId: organizationId,
		createdAt: { $gte: currentOrgUserJoinedAt },
		viewedBy: { $ne: userId }
  }));
});
