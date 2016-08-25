import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { sanitizeHtml } from 'meteor/djedi:sanitize-html-client';
import { Template } from 'meteor/templating';

import { addMessage, updateFilesUrls } from '/imports/api/messages/methods.js';
import { Discussions } from '/imports/api/discussions/discussions.js';
import { DocumentTypes } from '/imports/api/constants.js';
import { handleMethodResult } from '/imports/api/helpers.js';

/*
 * @param {String} standardId // the ID of the current standard
*/
Template.Discussion_AddMessage_Form.viewmodel({
	mixin: ['discussions', 'standard', 'organization'],

	disabled: false,
	files: [],
	messageFile: null,
	messageText: '',
	slingshotDirective: 'discussionsFiles',

	discussionId(){
		return this.getDiscussionIdByStandardId(this.standardId());
	},
	sendTextMessage() {
		if (this.disabled()) return;
		const discussionId = this.discussionId();

		addMessage.call({
			discussionId,
			message: sanitizeHtml(this.messageText()),
			type: 'text'
		}, handleMethodResult(() => {
			this.reset();
		}));
	},
	addFileFn() {
		return this.addFile.bind(this);
	},
	addFile({ fileId }, cb) {
		if (this.disabled()) return;

		const discussionId = this.discussionId();

		addMessage.call({
			discussionId,
			fileIds: [fileId],
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

		return { discussionId };
	},
});
