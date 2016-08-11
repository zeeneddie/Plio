/* @param {String} standardId // the ID of the current standart
*/

import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { addDiscussion } from '/imports/api/discussions/methods.js';
import { addMessage } from '/imports/api/messages/methods.js';
import { Discussions } from '/imports/api/discussions/discussions.js';
import { DocumentTypes } from '/imports/api/constants.js';
import { handleMethodResult } from '/imports/api/helpers.js';


Template.Discussion_AddMessage_Form.viewmodel({
	mixin: ['discussions', 'standard'],

	files: [],
	messageFile: null,
	messageText: '',
	slingshotDirective: '',

	addNewMessage() {
		addMessage.call(
			this.makeNewMessage(), handleMethodResult( () => {this.reset();} )
		);
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
		let discussionId = this.getDiscussionIdByStandardId(
			this.standardId()
		);

		if(!discussionId){
			discussionId = addDiscussion.call(
				{ documentType: DocumentTypes[0], linkedTo: this.standardId() },
				handleMethodResult( () => {this.reset();} )
			);
		}

		return {
			createdAt: new Date(),
			discussionId,
			files: [],
			message: this.messageText(),
			userId: Meteor.userId(),
			viewedBy: []
		};
	},

	onSubmit(ev){
		ev.preventDefault();

		if( !Meteor.userId() ){
			throw new Meteor.Error(
				403, 'Unauthorized user cannot add messages to discussions'
			);
		}
		if( !this.standardId() ){
			throw new Meteor.Error(
				403, 'Discussion messages may be added to the particular standart only'
			);
		}

		if(this.messageText() !== ''){
			this.addNewMessage();
		}
		else {
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
