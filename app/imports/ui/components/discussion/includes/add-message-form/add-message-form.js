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
	mixin: ['discussions', 'standard'],

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
	insertFileFn() {
    return this.insertFile.bind(this);
  },
  insertFile({ _id, name }, cb) {
		if (this.disabled()) return;

    const fileDoc = { _id, name, extension: name.split('.').pop().toLowerCase() };
		const discussionId = this.discussionId();

		addMessage.call({
			discussionId,
			files: [fileDoc],
			type: 'file'
		}, handleMethodResult(cb));

    /*if (this.files() && this.files().length) {
      const options = {
        $push: {
          files: fileDoc
        }
      };

      this.parent().update({ options }, cb);
    } else {
      this.parent().update({
        files: [fileDoc]
      }, cb);
    }*/
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

    updateFilesUrls.call({ _id, options });
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
		const discussionId = this.discussionId();

		return { discussionId };
	},
});
