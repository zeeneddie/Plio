import {Template} from 'meteor/templating';

import {Messages} from '/imports/api/messages/messages.js';
import {getFormattedDate} from '/imports/api/helpers.js';


Template.MessagesList.viewmodel({
	mixin: ['discussions', 'messages', 'standard'],

  onCreated(){
    //console.dir(this);
  },

  /* The _id of the first discussion from the sorted list of discussions
   * for this standardId
  */
  discussionId(){
    return this.getDiscussionIdByStandardId(
      this.standardId()
    );
  },

  /* First message document with the discussionId
  */
  messageOne1(protection){
    const discussionId = this.discussionId();

    return discussionId ? this.messageByDiscussionId(
      discussionId, protection && {}
    ) : null;
  },

  /* Cursor of messages documents with the discussionId
  */
  messagesCursor1(protection){
    const discussionId = this.discussionId();

    return discussionId ? this.messagesCursorByDiscussionId(
      discussionId, protection && {}
    ) : null;
  },

	messagesCount(){
    return this.messagesCursor1({ fields: {_id: 1} }).count();
	},

	messageFirst(){
    const m = this.messageOne1({
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
		const userId = Meteor.userId();
		let dateStorage;

    return this.messagesCursor1({
  			fields: {standardId: 0},
  			sort: {createdAt: 1}
  		}).map((c, i, cr) => {
			const user = Meteor.users.findOne({_id: c.userId}, {fields: {profile:1}});

			c.avatar = user.avatar();
			c.date = getFormattedDate(c.createdAt, 'MMMM Do, YYYY');
			c.dateToShow = dateStorage !== c.date;
			c.time = getFormattedDate(c.createdAt, 'HH:mm');
			c.username = user.firstName();

			if(dateStorage !== c.date){
				dateStorage = c.date;
			}

			return c;
		});
	}
});
