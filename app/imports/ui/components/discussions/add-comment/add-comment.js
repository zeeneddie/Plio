/* @param {String} standardId // the ID of the current standart
*/

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {addMessage} from '/imports/api/discussions/methods.js';


Template.AddComment.viewmodel({
	mixin: ['standard'],

	messageFile: null,
	messageText: '',

	onSubmit(ev){
		ev.preventDefault();

		const self = this;
		const msg = this.messageText();
		const standardId = this.standardId();
		const userId = Meteor.userId();

		if(!userId){
			throw new Meteor.Error(
				403, 'Unauthorized user cannot add messages to discussions'
			);
		}
		if(!standardId){
			throw new Meteor.Error(
				403, 'Discussion messages may be added to the particular standart only'
			);
		}

		if(msg !== ''){
			const message = {
				createdAt: new Date(),
				message: msg,
				standardId: standardId,
				userId: userId,
				viewedBy: []
			};

			addMessage.call(message, (err, res) => {
				if(err){
					// [ToDo][Modal] Show an error in a modal window?
					throw err;
				}
				else{
					self.messageFile.reset();
					self.messageText.reset();
				}
			});
		}
		else {
			//[ToDo][Modal] Ask to not add an empty message or just skip?
		}
	}
});
