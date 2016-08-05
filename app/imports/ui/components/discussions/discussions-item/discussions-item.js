import {Autolinker} from 'meteor/konecty:autolinker';
import {Template} from 'meteor/templating';

import {markMessageViewedById} from '/imports/api/discussions/methods.js';
import {removeMessageById} from '/imports/api/discussions/methods.js';
import {TruncatedStringLengths} from '/imports/api/constants.js';


Template.DiscussionsItem.viewmodel({
	onRendered(tpl){
		const _id = this._id();
		const userId = this.userId();

		if(this.viewedBy().indexOf(userId) < 0){
			markMessageViewedById.call({_id, userId}, (err, res) => {
				if(err){
					throw err;
				}
			});
		}
	},

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
	},

	messageRendered(){
		return Autolinker.link(
			this.message(), {truncate: TruncatedStringLengths.c40}
		);
	}
});
