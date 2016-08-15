import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { addMessage, update } from '/imports/api/messages/methods.js';
import { Discussions } from '/imports/api/discussions/discussions.js';
import { DocumentTypes } from '/imports/api/constants.js';
import { handleMethodResult } from '/imports/api/helpers.js';

/*
 * @param {String} standardId // the ID of the current standard
*/
Template.Discussion_AddMessage_Form.viewmodel({
	mixin: ['discussions', 'standard'],

	files: [],
	messageFile: null,
	messageText: '',
	slingshotDirective: '',

	sendTextMessage() {
		const discussionId = this.getDiscussionIdByStandardId(this.standardId());
		addMessage.call({
			discussionId,
			message: this.messageText(),
			type: 'text'
		}, handleMethodResult(() => {
			this.reset();
		}));
	},
	insertFileFn() {
    return this.insertFile.bind(this);
  },
  insertFile({ _id, name }, cb) {
    const fileDoc = { _id, name, extension: name.split('.').pop().toLowerCase() };
		const discussionId = this.getDiscussionIdByStandardId(this.standardId());
		addMessage.call({
			discussionId,
			files: [fileDoc],
			type: 'file'
		}, handleMethodResult);

    if (this.files() && this.files().length) {
      /*const options = {
        $push: {
          files: fileDoc
        }
      };

      this.parent().update({ options }, cb);*/
    } else {
      /*this.parent().update({
        files: [fileDoc]
      }, cb);*/
    }
		console.log('this.files()', this.files());
		console.log('fileDoc', fileDoc);
		console.log('cb', cb);
  },
	onUploadCb() {
    return this.onUpload.bind(this);
  },
  onUpload(err, { _id, url }) {
		console.log('started updating message');
    if (err && err.error !== 'Aborted') {

			// [TODO] Handle error
      return;
    }

    const query = {
      files: {
        $elemMatch: { _id }
      }
    };
    const options = {
      $set: {
        'files.$.url': url
      }
    };
		console.log('finishing updating message');
    update({ query, options });
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

	onUploadCb() {
    return this.onUpload.bind(this);
  },
  onUpload(err, { _id, url }) {
    if (err && err.error !== 'Aborted') {
      ViewModel.findOne('ModalWindow').setError(err.reason);
      return;
    }

    /*const query = {
      files: {
        $elemMatch: { _id }
      }
    };*/
    /*const options = {
      $set: {
        'files.$.url': url
      }
    };*/

    //this.parent().update({ query, options });
		console.log('onUpload');
  },

	uploaderMetaContext: {
		discussionId: ''
	}
});
