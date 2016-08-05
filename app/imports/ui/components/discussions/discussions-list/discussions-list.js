import {Template} from 'meteor/templating';

import {Discussions} from '/imports/api/discussions/discussion.js';
import {getFormattedDate} from '/imports/api/helpers.js';
import {markMessageViewedById} from '/imports/api/discussions/methods.js';


Template.DiscussionsList.viewmodel({
	mixin: ['standard'],

	messagesCount(){
		const self = this;
		
		return Discussions.find({
			standardId: self.standardId()
		}).count() > 0;
	},

	messageFirst(){
		const self = this;
		const m = Discussions.findOne({
			standardId: self.standardId()
		}, {
			fields: {createdAt: 1, userId: 1},
			limit: 1,
			sort: {createdAt: 1}
		});

		return {
			date: getFormattedDate(m.createdAt, 'MMMM Do, YYYY'),
			name: Meteor.users.findOne({_id: m.userId}).fullName()
		};
	},

	messages(){
		const self = this;
		const userId = Meteor.userId();
		let dateStorage;

		return Discussions.find({
			standardId: self.standardId()
		}, {
			fields: {standardId: 0},
			sort: {createdAt: 1}
		}).map((c, i, cr) => {
			const user = Meteor.users.findOne({_id: c.userId}, {fields: {profile:1}});

			c.avatar = user.avatar();
			c.date = getFormattedDate(c.createdAt, 'MMMM Do, YYYY');
			c.dateToShow = dateStorage !== c.date;
			c.time = getFormattedDate(c.createdAt, 'HH:mm');
			c.username = user.firstName();

			/*if(c.viewedBy.indexOf(userId) < 0){
				markMessageViewedById.call({_id: c._id, userId: userId}, (err, res) => {
					if(err){
						throw err;
					}
				});
			}*/

			if(dateStorage !== c.date){
				dateStorage = c.date;
			}
			
			return c;
		});
	}
});
