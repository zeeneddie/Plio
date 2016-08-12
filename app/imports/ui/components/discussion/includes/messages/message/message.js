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

		if (!Object.assign([], this.viewedBy()).find(val => val === Meteor.userId())) {
			markMessageViewedById.call({ _id }, handleMethodResult((err, res) => {}));
		}

		const $chat = $(tpl.firstNode).closest('.chat-content');
		$chat.scrollTop($chat.find('.chat-messages').height());
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
	},

	copyAsLink(e) {
		e.preventDefault();
	},

	remove(e) {
		if (!this.isAuthor()) return;

		const callback = (err, res) => {
			if (err) return;
			// Delete the Discussion itself if it has no messages any more
			if (this.isDiscussionEmpty()) {
				removeDiscussionById.call(
					{ _id: self.discussionId() }, handleMethodResult((err, res) => {})
				);
			}
		};

		removeMessageById.call({ _id: this._id() }, handleMethodResult(callback));
	}
});
