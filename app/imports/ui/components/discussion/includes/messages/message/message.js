import { Autolinker } from 'meteor/konecty:autolinker';
//import { Clipboard } from 'meteor/xvendo:clipboardjs';
import Clipboard from 'clipboard';
import { Template } from 'meteor/templating';

import { handleMethodResult } from '/imports/api/helpers.js';
import { removeMessageById } from '/imports/api/messages/methods.js';
import { TruncatedStringLengths } from '/imports/api/constants.js';
import { getFormattedDate } from '/imports/api/helpers.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import get from 'lodash.get';


Template.Discussion_Message.viewmodel({
	mixin: ['discussions', 'organization', 'standard'],

	onRendered(tpl) {
		const $chat = $(tpl.firstNode).closest('.chat-content');
		$chat.scrollTop($chat.find('.chat-messages').height());

		const clipboard = new Clipboard('.js-message-copy-link');
	},
	getFormattedDate: getFormattedDate,
	uploader() {
	  //return this.child('FileUploader');
		return ViewModel.findOne('FileUploader2');
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
	isSelected() {
		return FlowRouter.getQueryParam('at') === this._id();
	},
	formattedMessageText() {
		return Autolinker.link(
			this.message(), { truncate: TruncatedStringLengths.c40 }
		);
	},
	copyAsLink(e) {
		e.preventDefault();
	},
	pathToMessage() {
		const currentRouteName = FlowRouter.getRouteName();
    const params = FlowRouter.current().params;
		const queryParams = { at: this._id() };

    return FlowRouter.path(currentRouteName, params, queryParams);
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
