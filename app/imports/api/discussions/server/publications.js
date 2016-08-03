import { Meteor } from 'meteor/meteor';

import { Discussions } from '../discussion.js';


Meteor.publish('discussionsByStandart', function(standardId){
	const userIds = [];
	const discussions = Discussions.find({standardId});

	discussions.forEach((c, i, cr) => {
		if(userIds.indexOf(c.userId) < 0){
			userIds.push(c.userId);
		}
	});

	return [
		discussions,
		Meteor.users.find({ _id: {$in: userIds} }, { fields: {profile: 1} })
	];
});
