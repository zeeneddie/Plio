import {Template} from 'meteor/templating';

import {Discussions} from '/imports/api/discussions/discussion.js';


Template.DiscussionsHeader.viewmodel({
	mixin: ['standard'],

	unreadMessages(){
		const self = this;

		return Discussions.find({
			isRead: false,
			standardId: self.standardId()
		}, {
			fields: {isRead: 1}
		}).count();
	}
});
