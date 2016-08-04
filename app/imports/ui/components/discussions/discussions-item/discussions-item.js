import {Template} from 'meteor/templating';


Template.DiscussionsItem.viewmodel({
	events: {
		'click .js-message-actions'(ev, tpl){
			ev.preventDefault();
		}
	},

	isAuthor(){
		return Meteor.userId() === this.userId();
	}
});
