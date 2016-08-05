/* @param {String} standardId // the ID of the current standart
*/

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {addMessage} from '/imports/api/discussions/methods.js';
import {handleMethodResult} from '/imports/api/helpers.js';


Template.AddComment.viewmodel({
	mixin: ['standard'],

	messageFile: null,
	messageText: '',

	addNewMessage(){
		addMessage.call(
			this.makeNewMessage(), handleMethodResult( () => {this.reset();} )
		);
	},

	makeNewMessage(){
		return {
			createdAt: new Date(),
			message: this.messageText(),
			standardId: this.standardId(),
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
	}
});
