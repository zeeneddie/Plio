import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { sanitizeHtml } from 'meteor/djedi:sanitize-html-client';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';

import {
	insert as insertMessage
} from '/imports/api/messages/methods.js';
import { Discussions } from '/imports/api/discussions/discussions.js';
import { DocumentTypes } from '/imports/api/constants.js';
import { handleMethodResult } from '/imports/api/helpers.js';
import { MessageSubs } from '/imports/startup/client/subsmanagers.js';


const defaults = {
	file: '',
	messageFile: null,
	messageText: ''
};

const scrollToBottom = () => {
	const $chat = $('.chat-content');

	$chat.scrollTop($chat.prop('scrollHeight'));
};

Template.Discussion_AddMessage_Form.viewmodel({
	share: 'messages',
	mixin: ['discussions', 'standard', 'organization'],
	disabled: false,
	slingshotDirective: 'discussionFiles',
	...defaults,
	discussionId() {
		return this.getDiscussionIdByStandardId(this.standardId());
	},
	reInit() {
		if (FlowRouter.getQueryParam('at')) {
			MessageSubs.clear();

			MessageSubs.reset();

			FlowRouter.setQueryParams({ at: null });

			// Shared props with Discussion_Messages
			this._scrollProps(null);  					// <

			this.isInitialDataReady(false);     // <

			this.options({                      // <
				...this.options(),
				at: null
			});
		}
	},
	sendTextMessage() {
		if (this.disabled()) return;

		const discussionId = this.discussionId();

		this.reInit();
		insertMessage.call({
			organizationId: this.organizationId(),
			discussionId,
			text: sanitizeHtml(this.messageText()),
			type: 'text'
		}, handleMethodResult((err, res) => {
      if (res) {
				// cannot use vm's reset there cause of shared props
        this.load(defaults);

				 scrollToBottom();
        // [ToDo] Call a ringtone on a successful message addition
      }
		}));
	},
	addFileFn() {
		return this.addFile.bind(this);
	},
	addFile({ fileId }, cb) {
		if (this.disabled()) return;

		const discussionId = this.discussionId();

		insertMessage.call({
			organizationId: this.organizationId(),
			discussionId,
			fileId,
			type: 'file'
		}, handleMethodResult(cb));
	},
	onSubmit(e) {
		e.preventDefault();

		if (!Meteor.userId()) return;

		if (!this.standardId()) {
			swal(
				'Oops... Something went wrong',
				'Discussion messages may be added to the particular standard only',
				'error'
			);
		}

		if (!!this.messageText()) {
			this.sendTextMessage();
		} else {
			//[ToDo][Modal] Ask to not add an empty message or just skip?
		}
	},
	uploaderMetaContext() {
		const organizationId = this.organizationId();
		const discussionId = this.discussionId();

		return { organizationId, discussionId };
	},
});
