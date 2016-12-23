import { Meteor } from 'meteor/meteor';
import property from 'lodash.property';
import get from 'lodash.get';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Discussions } from '/imports/share/collections/discussions.js';
import { Messages } from '/imports/share/collections/messages.js';
import { Files } from '/imports/share/collections/files.js';
import { isOrgMember } from '../../checkers.js';
import { getJoinUserToOrganizationDate } from '/imports/api/organizations/utils.js';
import { Match } from 'meteor/check';
import Counter from '../../counter/server.js';
import { getNewerDate, getC } from '../../helpers.js';
import { getUserViewedByData } from '../../discussions/helpers.js';

const getLastMessageId = (query, options) => ({
	lastMessageId: get(Messages.findOne(query, _.omit(options, 'limit')), '_id')
});

const getMessageData = (id) => {
	let text = '';
	const message = Object.assign({}, Messages.findOne({ _id: id }));

	if (message.type === 'file' && message.fileId) {
		const file = Files.findOne({ _id: message.fileId }, { fields: { name: 1 } });
		text = file.name;
	} else {
		text = message.text
	}

	const organization = Object.assign({}, Organizations.findOne({
		_id: message.organizationId
	}, {
		fields: { serialNumber: 1 }
	}));

	const discussion = Object.assign({}, Discussions.findOne({
		_id: message.discussionId
	}, {
		fields: { linkedTo: 1, documentType: 1 }
	}));

	const route = {};
	if (discussion.documentType === 'standard') {
		route.name = 'standardDiscussion';
		route.params = { orgSerialNumber: organization.serialNumber, standardId: discussion.linkedTo };
		route.query = { at: message._id };
	}

	const user = Meteor.users.findOne({
		_id: message.createdBy
	}, {
		fields: { profile: 1, emails: 1 }
	});

	const messageData = {
		text,
		userAvatar: user && user.profile.avatar,
		userFullNameOrEmail: user && user.fullNameOrEmail(),
		route: route,
		createdBy: message.createdBy
	};

	return messageData;
};

Meteor.publishComposite('messages', function(discussionId, {
	sort = { createdAt: -1 },
	at = null,
	priorLimit = 50,
	followingLimit = 50
} = {}) {
	check(discussionId, String);

	new SimpleSchema({
		priorLimit: { type: Number },
		followingLimit: { type: Number },
		at: {
			type: String,
			regEx: SimpleSchema.RegEx.Id,
			optional: true
		},
		sort: {
			type: new SimpleSchema({
				createdAt: { type: Number }
			})
		}
	}).validate({ sort, at, priorLimit, followingLimit });

	return {
		find() {
			if (at) {
				const msg = Object.assign({}, Messages.findOne({ _id: at }));
				const getMessages = (l, c) => {
					const sign = c > 0 ? '$gte' : '$lte';
					const query = { createdAt: { [sign]: msg.createdAt } };
					const options = { limit: l, sort: { createdAt: c } };
					return Messages.find(query, options).fetch();
				}
				const prior = getMessages(priorLimit, -1);
				const following = getMessages(followingLimit, 1);
				const query = {
					createdAt: {
						$lte: following.length && _.last(following).createdAt,
						$gte: prior.length && _.last(prior).createdAt
					}
				};
				const options = { sort: { createdAt: 1 } };
				return Messages.find(query, options);
			}

			const query = { discussionId };
			const options = { sort, limit: followingLimit };
			return Messages.find(query, options);
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

Meteor.publish('discussionMessagesLast', function(discussionId) {
	check(discussionId, String);

	const discussion = Object.assign({}, Discussions.findOne({ _id: discussionId }));

	if (!this.userId || !isOrgMember(this.userId, get(discussion, 'organizationId'))) {
		return this.ready();
	}

	let initializing = true;

	const query = { discussionId };
	const options = { sort: { createdAt: -1 }, limit: 1, fields: { _id: 1 } };

	const getId = () => Object.assign({}, getLastMessageId(query, options)).lastMessageId;
	const getData = (_id) => {
		const { _id:lastMessageId, createdBy } = Object.assign({}, Messages.findOne({ _id }));
		return { lastMessageId, createdBy };
	};

	const handle = Messages.find(query, options).observeChanges({
		added: (id) => {
			if (!initializing) {
				this.changed('lastDiscussionMessage', discussionId, getData(id));
			}
		},
		removed: (id) => {
			if (!initializing) {
				this.changed('lastDiscussionMessage', discussionId, getData(getId()));
			}
		}
	});

	initializing = false;

	this.added('lastDiscussionMessage', discussionId, getData(getId()));

	this.ready();

	this.onStop(() => handle.stop());
});

Meteor.publish('organizationMessagesLast', function(organizationId) {
	check(organizationId, String);

	if (!this.userId || !isOrgMember(this.userId, organizationId)) {
		return this.ready();
	}

	let initializing = true;

	const query = { organizationId };
	const options = { sort: { createdAt: -1 }, limit: 1, fields: { _id: 1 } };

	const handle = Messages.find(query, options).observeChanges({
		added: (id) => {
			if (!initializing) {
				this.changed('lastOrganizationMessage', organizationId, getMessageData(id));
			}
		},
		removed: (id) => {
			if (!initializing) {
				this.changed('lastOrganizationMessage', organizationId);
			}
		}
	});

	initializing = false;

	const messageId = getLastMessageId(query, options);
	this.added('lastOrganizationMessage', organizationId, getMessageData(messageId));

	this.ready();

	this.onStop(() => handle.stop());
});

// Unread messages by the logged in user, with info about users that created
// the messages.
Meteor.publishComposite('unreadMessages', function({ organizationId, limit }) {
	check(organizationId, String);

	const userId = this.userId;
	const getUserData = getUserViewedByData(userId);
	const currentOrgUserJoinedAt = getJoinUserToOrganizationDate({
    organizationId, userId
  });

	return {
		find() {
			if (!userId || !isOrgMember(userId, organizationId)) {
		    return this.ready();
		  }

			return Discussions.find({ organizationId });
		},
		children: [{
			find: function(discussion) {
				const { _id:discussionId } = discussion;
				const { viewedUpTo } = Object.assign({}, getUserData(discussion));
				const query = {
					discussionId,
					organizationId,
					createdAt: {
						$gt: getNewerDate(currentOrgUserJoinedAt, viewedUpTo)
					}
				};
				const options = {
					sort: {
						createdAt: -1
					}
				};

				// Check if limit is an integer number
				if (Number(limit) === limit && limit % 1 === 0) {
					options.limit = limit;
				}

				return Messages.find(query, options);
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
		}]
	}
});

Meteor.publish('messagesNotViewedCount', function(counterName, documentId) {
	check(counterName, String);
	check(documentId, String);

  const userId = this.userId;
	const discussion = Object.assign({}, Discussions.findOne({ linkedTo: documentId, isPrimary: true }));
	const discussionId = discussion._id;
	const organizationId = discussion.organizationId;

	if (!discussionId || !userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

	const currentOrgUserJoinedAt = getJoinUserToOrganizationDate({
		organizationId, userId
	});
	const { viewedUpTo = null } = Object.assign({}, getUserViewedByData(userId, discussion));

  return new Counter(counterName, Messages.find({
    discussionId,
		organizationId,
		createdAt: {
			$gt: getNewerDate(viewedUpTo, currentOrgUserJoinedAt)
		}
  }));
});

Meteor.publish('messagesNotViewedCountTotal', function(counterName, organizationId) {
	check(counterName, String);
	check(organizationId, String);

  const userId = this.userId;

	if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

	const currentOrgUserJoinedAt = getJoinUserToOrganizationDate({
		organizationId, userId
	});
	const discussions = Discussions.find({ organizationId });
	const viewedByData = discussions.map((discussion) => {
		const { viewedUpTo } = Object.assign({}, getUserViewedByData(userId, discussion));

		return {
			viewedUpTo,
			discussionId: discussion._id
		};
	});

	const $or = viewedByData.map(({ viewedUpTo, discussionId }) => ({
		discussionId,
		createdAt: {
			$gt: getNewerDate(viewedUpTo, currentOrgUserJoinedAt)
		}
	}));

	const query = {
		organizationId,
		...(() => $or.length ? { $or } : null)()
	};

	return new Counter(counterName, Messages.find(query));
});
