import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { sanitizeHtml } from 'meteor/djedi:sanitize-html-client';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';

import {
	addFilesToMessage, addMessage, getMessages, removeFileFromMessage, removeMessageById,
	updateFilesUrls
} from '/imports/api/messages/methods.js';
import { Discussions } from '/imports/api/discussions/discussions.js';
import { DocumentTypes } from '/imports/api/constants.js';
import { handleMethodResult } from '/imports/api/helpers.js';
import { MessageSubs } from '/imports/startup/client/subsmanagers.js';


const defaults = {
	files: [],
	messageFile: null,
	messageText: ''
};

const scrollToBottom = () => {
	const $chat = $('.chat-content');

	$chat.scrollTop($chat.prop('scrollHeight'));
};

Template.Discussion_AddMessage_Form.viewmodel({
	share: 'messages',
	mixin: ['discussions', 'standard'],
	disabled: false,
	slingshotDirective: 'discussionsFiles',
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

		addMessage.call({
			discussionId,
			message: sanitizeHtml(this.messageText()),
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
	insertFileFn() {
    return this.insertFile.bind(this);
  },

	/* Insert file info as documents into Messages collection:
	 * @param {Array} fileDocs - file documents to save;
	 * @param {Function} cb - callback function.
	*/
  insertFile(fileDocs, cb) {
		if (this.disabled()) return;

		const discussionId = this.discussionId();
		let fileDoc;
		let fileDocId;

		const extendWithScroll = fn => (err, res) => {
			scrollToBottom();

			fn(err, res);
		};

		Tracker.afterFlush(() => this.reInit());

		if (!(fileDocs instanceof Array)) {
			fileDoc = {
				_id: fileDocs._id,
				name: fileDocs.name,
				extension: fileDocs.name.split('.').pop().toLowerCase()
			};

			fileDocId = addMessage.call({
				discussionId,
				files: [fileDoc],
				type: 'file'
			}, handleMethodResult(extendWithScroll(cb)));

			return;
		}

		fileDocs.forEach((fileDocArg, i) => {
			// File document to save with a message doc in Messages collection
			fileDoc = {
				_id: fileDocArg._id,
				name: fileDocArg.name,
				extension: fileDocArg.name.split('.').pop().toLowerCase()
			};
			const cbf = function(_id, i) {
				// Pass each file's ID into callback, so that right file was inserted in S3
				return function(err, res) {
					scrollToBottom();

					cb(err, res, fileDocObj = {_id, i});
				}
			}(fileDoc._id, i);

			if(i === 0){
				// Add a new message in Messages collection with 1st file doc
				fileDocId = addMessage.call({
					discussionId,
					files: [fileDoc],
					type: 'file'
				}, handleMethodResult(cbf));
			}
			else{
				// Other file docs add to just inserted new message above
				const options = {
	        $push: {
	          files: fileDoc
	        }
	      };

				return addFilesToMessage.call({
					_id: fileDocId, options
				}, handleMethodResult(cbf));
			}
		});
  },
	onUploadCb() {
    return this.onUpload.bind(this);
  },
  onUpload(err, { _id, url }) {
    if (err && err.error !== 'Aborted') {
			// [TODO] Handle error
      return;
    }

    const options = {
      $set: {
        'files.$.url': url
      }
    };

    updateFilesUrls.call(
      { _id, options }, handleMethodResult((err, res) => {
        if(res){
          // [ToDo] call a ringtone on a success file addition
        }
      })
    );
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

	/* Removes a file document from a message document,
   * but not the file itself from S3:
   * @param {string} fileId - an identifier of the file which is to remove.
  */
	removeFileFromMessage(fileId) {
    const self = this;
    const query = { 'files._id': fileId };
		const options = { fields: { files: 1 } };
		const messagesWithFileId = getMessages.call({ query, options });

    messagesWithFileId.forEach((message) => {
      if(message.files.length > 1) {
        removeFileFromMessage.call({ _id: fileId });
      }
      else{
        self.removeFileMessage(fileId);
      }
    });
	},
	removeFileFromMessageCb() {
		return this.removeFileFromMessage.bind(this);
	},

	/* Removes the message document with files from the Messages collection,
	 * but not the file itself from S3:
	 * @param {String} fileId - the file ID in the "files" array;
	*/
	removeFileMessage(fileId) {
		const query = { 'files._id': fileId };
		const options = { fields: { _id: 1 } };
		const messagesWithFileId = getMessages.call({query, options});

		if (!messagesWithFileId.count()) {
			return;
		}

		messagesWithFileId.forEach((c, i, cr) => {
			removeMessageById.call({ _id: c._id });
		});
	},
	removeFileMessageCb(){
		return this.removeFileMessage.bind(this);
	},
	uploaderMetaContext() {
		const discussionId = this.discussionId();

		return { discussionId };
	},
});
