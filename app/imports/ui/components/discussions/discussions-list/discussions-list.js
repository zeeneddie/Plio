import {moment} from 'meteor/momentjs:moment';
import {Template} from 'meteor/templating';

import {Discussions} from '/imports/api/discussions/discussion.js';


Template.DiscussionsList.viewmodel({
	mixin: ['standard'],

	messages(){
		const self = this;
		return Discussions.find({
			standardId: self.standardId()
		}, {
			fields: {standardId: 0},
			sort: {createdAt: 1}
		}).map((c, i, cr) => {
			const user = Meteor.users.findOne({_id: c.userId}, {fields: {profile:1}});
			console.dir(user);
			c.avatar = user.avatar();
			c.date = moment(c.createdAt).format('YYYY MMMM Do');
			c.time = moment(c.createdAt).format('HH:mm');
			c.username = user.firstName();
			console.dir(c);
			return c;
		});
	}
});