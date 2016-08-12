import { Meteor } from 'meteor/meteor';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '../messages.js';


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
