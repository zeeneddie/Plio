import {Template} from 'meteor/templating';

import {Discussions} from '/imports/api/discussions/discussion.js';


Template.DiscussionsHeader.viewmodel({
	mixin: ['standard'],

	unreadMessages(){
		const self = this;

		return Discussions.find({
			standardId: self.standardId(),
			viewedBy: { $ne: Meteor.userId() }
		}, {
			fields: {viewedBy: 1}
		}).count();
	}
});
