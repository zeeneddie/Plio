import { Autolinker } from 'meteor/konecty:autolinker';
import Clipboard from 'clipboard';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import get from 'lodash.get';

import { getFormattedDate } from '/imports/api/helpers.js';
import { handleMethodResult } from '/imports/api/helpers.js';
import { removeMessageById } from '/imports/api/messages/methods.js';
import { TruncatedStringLengths } from '/imports/api/constants.js';


Template.Discussion_Message.viewmodel({
	mixin: ['discussions', 'organization', 'standard'],

	onRendered(tpl) {
		const $chat = $(tpl.firstNode).closest('.chat-content');
		$chat.scrollTop($chat.find('.chat-messages').height());

		const clipboard = new Clipboard('.js-message-copy-link');

		tpl.$('.js-chat-item-avatar').popover({
			content: `<img class="chat-item-avatar-in-popover" src="${this.avatar()}" alt="">`,
			html: true,
			offset: '-29px 12px',
			template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><div class="popover-content"></div></div>',
			trigger: 'focus'
		});
	},
	getFormattedDate: getFormattedDate,
	uploader() {
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
		const message = this.message && this.message();

		return message && Autolinker.link(
			message, { truncate: TruncatedStringLengths.c40 }
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
	pathToMessageToCopy() {
		const ptm = this.pathToMessage();
		const url = `${location.protocol}//${location.hostname}:${location.port}`;

		return `${url}${ptm}`;
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
			confirmButtonText: "Remove",
			closeOnConfirm: false
		},
		function(){
			removeMessageById.call({ _id }, handleMethodResult(callback));
		});
	}
});
