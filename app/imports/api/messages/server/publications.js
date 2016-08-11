import { Meteor } from 'meteor/meteor';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '../messages.js';


Meteor.publish('messagesByStandardId', function(standardId){
	const userIds = [];
	const discussion = Discussions.findOne({linkedTo: standardId}, {
		fields: {_id: 1}
	});

	if(!discussion){
		return this.ready();
	}

	const discussionId = discussion._id;
	const messages = Messages.find({discussionId});

	messages.forEach((c, i, cr) => {
		if(userIds.indexOf(c.userId) < 0){
			userIds.push(c.userId);
		}
	});

	return [
		messages,
		Meteor.users.find({ _id: {$in: userIds} }, { fields: {profile: 1} })
	];
});
