import {Template} from 'meteor/templating';

import {removeMessageById} from '/imports/api/discussions/methods.js';


Template.DiscussionsItem.viewmodel({
	events: {
		'click .js-message-actions > a'(ev, tpl){
			ev.preventDefault();
		},

		'click .js-message-remove'(ev, tpl){
			if(Meteor.userId() !== this.userId() ){
				return false;
			}

			removeMessageById.call({_id: this._id()}, (err, res) => {
				if(err){
					throw err;
				}
				else{
					// [ToDo] Handle with a modal window?
				}
			});
		}
	},

	isAuthor(){
		return Meteor.userId() === this.userId();
	},

	linkerOptions(){
		return {
			truncate: 7
		}
	}
});
