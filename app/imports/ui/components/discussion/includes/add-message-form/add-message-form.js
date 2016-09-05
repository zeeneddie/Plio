import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { sanitizeHtml } from 'meteor/djedi:sanitize-html-client';
import { Template } from 'meteor/templating';

import {
	insert as insertMessage,
	getMessages,
	updateProgress,
	updateUrl
} from '/imports/api/messages/methods.js';
import { Discussions } from '/imports/api/discussions/discussions.js';
import { DocumentTypes } from '/imports/api/constants.js';
import { handleMethodResult } from '/imports/api/helpers.js';


Template.Discussion_AddMessage_Form.viewmodel({
	mixin: ['discussions', 'standard', 'organization'],

	disabled: false,
	files: [],
	messageFile: null,
	messageText: '',
	slingshotDirective: 'discussionFiles',

	discussionId(){
		return this.getDiscussionIdByStandardId(this.standardId());
	},
	sendTextMessage() {
		if (this.disabled()) return;
		const discussionId = this.discussionId();

		insertMessage.call({
			organizationId: this.organizationId(),
			discussionId,
			message: sanitizeHtml(this.messageText()),
			type: 'text'
		}, handleMethodResult((err, res) => {
      if(res){
        this.reset();

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

	// /* Removes a file document from a message document,
  //  * but not the file itself from S3:
  //  * @param {string} fileId - an identifier of the file which is to remove.
  // */
	// removeFileFromMessage(fileId){
  //   const self = this;
  //   const query = { 'files._id': fileId};
	// 	const options = { fields: {files: 1} };
	// 	const messagesWithFileId = getMessages.call({query, options});
	//
  //   messagesWithFileId.forEach((message) => {
  //     if(message.files.length > 1){
  //       removeFileFromMessage.call({ _id: fileId });
  //     }
  //     else{
  //       self.removeFileMessage(fileId);
  //     }
  //   });
	// },
	// removeFileFromMessageCb(){
	// 	return this.removeFileFromMessage.bind(this);
	// },

	// /* Removes the message document with files from the Messages collection,
	//  * but not the file itself from S3:
	//  * @param {String} fileId - the file ID in the "files" array;
	// */
	// removeFileMessage(fileId){
	// 	const query = { 'files._id': fileId};
	// 	const options = { fields: {_id: 1} };
	// 	const messagesWithFileId = getMessages.call({query, options});
	//
	// 	if(!messagesWithFileId.count()){
	// 		return;
	// 	}
	//
	// 	messagesWithFileId.forEach((c, i, cr) => {
	// 		removeMessageById.call({_id: c._id});
	// 	});
	// },
	// removeFileMessageCb(){
	// 	return this.removeFileMessage.bind(this);
	// },
	uploaderMetaContext() {
		const organizationId = this.organizationId();
		const discussionId = this.discussionId();

		return { discussionId };
	},
});
