import { Meteor } from 'meteor/meteor';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '../messages.js';
import { Files } from '/imports/api/files/files.js';
import { isOrgMember } from '../../checkers.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import Counter from '../../counter/server.js';

Meteor.publishComposite('messagesByDiscussionIds', function ({ discussionIds, organizationId }) {
	return {
		find() {
			const userId = this.userId;
			if (!userId || !isOrgMember(userId, organizationId)) {
		    return this.ready();
		  }

			return Messages.find({ organizationId, discussionId: { $in: discussionIds } });
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
