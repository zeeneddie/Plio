import { Meteor } from 'meteor/meteor';
import property from 'lodash.property';
import get from 'lodash.get';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '../messages.js';
import { Files } from '/imports/api/files/files.js';
import { isOrgMember } from '../../checkers.js';
import { getJoinUserToOrganizationDate } from '/imports/api/organizations/utils.js';
import { Match } from 'meteor/check';
import Counter from '../../counter/server.js';

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
	limit = 50,
	sort = { createdAt: -1 },
	at = null
} = {}) {
	check(discussionId, String);
	console.log(arguments);

	new SimpleSchema({
		limit: { type: Number },
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
	}).validate({ limit, sort, at });

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

			options.sort = {
				createdAt: -1
			};

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
				return Discussions.find({ _id: message.discussionId }, { fields: { linkedTo: 1, organizationId: 1, documentType: 1 } });
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
	check(counterName, String);
	check(documentId, String);

  const userId = this.userId;
	const discussion = Object.assign({}, Discussions.findOne({ linkedTo: documentId, isPrimary: true }));
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
	check(counterName, String);
	check(organizationId, String);

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
