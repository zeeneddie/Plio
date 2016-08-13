import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { addMessage } from '/imports/api/messages/methods.js';
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

	addNewMessage() {
		const discussionId = this.getDiscussionIdByStandardId(this.standardId());
		addMessage.call({
			discussionId,
			message: this.messageText()
		}, (err) => {
			console.log(err);
			 this.reset();
		 });
	},

	insertFileFn() {
    return this.insertFile.bind(this);
  },
  insertFile({ _id, name }, cb) {
    const fileDoc = { _id, name, extension: name.split('.').pop().toLowerCase() };

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
		console.log( this.files() );
		console.log(fileDoc);
		console.log(cb);
  },

	makeNewMessage(files) {
		const discussionId = (() => {
			const existingId = this.getDiscussionIdByStandardId(this.standardId());

			if (existingId) return existingId;
		})();

		return {
			discussionId,
			message: this.messageText()
		};
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
			this.addNewMessage();
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
