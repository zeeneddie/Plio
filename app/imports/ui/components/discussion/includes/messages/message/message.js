import { Autolinker } from 'meteor/konecty:autolinker';
import { Template } from 'meteor/templating';

import { handleMethodResult } from '/imports/api/helpers.js';
import { removeMessageById } from '/imports/api/messages/methods.js';
import { TruncatedStringLengths } from '/imports/api/constants.js';


Template.Discussion_Message.viewmodel({
	mixin: 'discussions',

	onRendered(tpl) {
		const $chat = $(tpl.firstNode).closest('.chat-content');
		$chat.scrollTop($chat.find('.chat-messages').height());
	},
	uploader() {
	  return this.child('FileUploader');
	},
	isAuthor() {
		return Meteor.userId() === this.createdBy();
	},
	isTextMessage() {
		return this.type() === 'text';
	},
	isFileMessage() {
		return this.type() === 'file';
	},
	isDiscussionEmpty() {
		return !this.discussionHasMessages(this.discussionId());
	},
	formattedMessageText() {
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
		};

		removeMessageById.call({ _id: this._id() }, handleMethodResult(callback));
	}
});
