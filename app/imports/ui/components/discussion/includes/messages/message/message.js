import { Autolinker } from 'meteor/konecty:autolinker';
import { Template } from 'meteor/templating';

import { handleMethodResult } from '/imports/api/helpers.js';
import { removeDiscussionById } from '/imports/api/discussions/methods.js';
import {
	markMessageViewedById, removeMessageById
} from '/imports/api/messages/methods.js';
import { TruncatedStringLengths } from '/imports/api/constants.js';


Template.Discussion_Message.viewmodel({
	mixin: 'discussions',
	
	onRendered(tpl) {
		const _id = this._id();
		const userId = this.userId();

		if(this.viewedBy().indexOf(userId) < 0){
			markMessageViewedById.call(
				{_id, userId}, handleMethodResult((err, res) => {})
			);
		}
	},

	events: {
		'click .js-message-actions > a'(ev, tpl) {
			ev.preventDefault();
		},

		'click .js-message-remove'(ev, tpl) {
			const self = this;

			if(Meteor.userId() !== this.userId()) {
				return false;
			}

			removeMessageById.call(
				{_id: this._id()}, handleMethodResult((err, res) => {

					// Delete the Discussion itself if it has no messages any more
					if(res && self.isDiscussionEmpty()) {
						console.log('Remove the discussion');
						removeDiscussionById.call(
							{_id: self.discussionId()}, handleMethodResult(
								(err, res) => {}
							)
						);
					}
				})
			);
		}
	},

	isAuthor() {
		return Meteor.userId() === this.userId();
	},
	isDiscussionEmpty() {
		return !this.discussionHasMessages(this.discussionId());
	},

	linkerOptions() {
		return {
			truncate: 7
		}
	},

	messageRendered() {
		return Autolinker.link(
			this.message(), { truncate: TruncatedStringLengths.c40 }
		);
	}
});
