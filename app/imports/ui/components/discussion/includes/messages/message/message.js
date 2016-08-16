import { Autolinker } from 'meteor/konecty:autolinker';
import { Template } from 'meteor/templating';

import { handleMethodResult } from '/imports/api/helpers.js';
import { removeMessageById } from '/imports/api/messages/methods.js';
import { TruncatedStringLengths } from '/imports/api/constants.js';


Template.Discussion_Message.viewmodel({
	mixin: 'discussions',
	share: 'files',

	onRendered(tpl) {
		const $chat = $(tpl.firstNode).closest('.chat-content');
		$chat.scrollTop($chat.find('.chat-messages').height());
	},
	uploader() {
	  //return this.child('FileUploader');
		const uploader = this.uploaderLink();console.dir(uploader);
		return uploader;
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

		const _id = this._id();
		const callback = (err, res) => {
			if (err) return;

			swal("Deleted!", "Your message has been deleted.", "success");
		};

		swal({
			title: "Are you sure you want to delete this message?",
			text: "This cannot be undone.",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Remove",
			closeOnConfirm: false
		},
		function(){
			removeMessageById.call({ _id }, handleMethodResult(callback));
		});
	}
});
