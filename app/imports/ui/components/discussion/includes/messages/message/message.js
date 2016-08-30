import { Autolinker } from 'meteor/konecty:autolinker';
import Clipboard from 'clipboard';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import get from 'lodash.get';
import invoke from 'lodash.invoke';

import { getFormattedDate } from '/imports/api/helpers.js';
import { handleMethodResult } from '/imports/api/helpers.js';
import { removeMessageById } from '/imports/api/messages/methods.js';
import { Messages } from '/imports/api/messages/messages.js';
import { TruncatedStringLengths } from '/imports/api/constants.js';

const getDOMNodes = template => ({
	$chat: $(template.firstNode).closest('.chat-content'),
	$message: template.$('.chat-message-container')
});

Template.Discussion_Message.viewmodel({
	mixin: ['discussions', 'organization', 'standard', 'modal'],
	onRendered(template) {
		const clipboard = new Clipboard('.js-message-copy-link');

		const at = FlowRouter.getQueryParam('at');
		const _id = invoke(this, '_id');
		const { $chat, $message } = getDOMNodes(template);
		const msgOffset = $message.offset().top;

		if (Object.is(at, _id)) {
			// scroll to the center of the linked message
			const elHeight = $message.height();
			const chatHeight = $chat.height();

			const offset = msgOffset - ((chatHeight / 2) - (elHeight / 2));

			$chat.scrollTop(offset);
		}
	},
	getFormattedDate: getFormattedDate,
	uploader() {
		return ViewModel.findOne('DiscussionsFileUploader');
	},
	isAuthor() {
		return Meteor.userId() === this.createdBy();
	},
	isType(type) {
		return this.type() === type;
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
	deselect(e) {
		const at = FlowRouter.getQueryParam('at');
		if (at === this._id()) {
			FlowRouter.setQueryParams({ at: null });
		}
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
	},
	openUserDetails() {
		this.modal().open({
      template: 'UserDirectory_Card_Read_Inner',
      _title: 'User details',
      user: this.user()
    });
	}
});
