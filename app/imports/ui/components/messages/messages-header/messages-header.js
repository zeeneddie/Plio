import {Template} from 'meteor/templating';

import {Messages} from '/imports/api/messages/messages.js';


Template.MessagesHeader.viewmodel({
	mixin: ['standard'],

	unreadMessages(){
		const self = this;

		return Messages.find({
			standardId: self.standardId(),
			viewedBy: { $ne: Meteor.userId() }
		}, {
			fields: {viewedBy: 1}
		}).count();
	}
});
