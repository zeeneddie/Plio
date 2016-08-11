import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';

import { Discussions } from '/imports/api/discussions/discussions.js';


Template.StandardDiscussionLayout.viewmodel({
	mixin: ['organization', 'standard'],
	_subsHandlers: {},
	isOrganisation: true, // [ToDo] Check if the organisation exists?
	isReady: false,
	isStandart: true, // [ToDo] Check if the standart exists?

	autorun: [
		function(){
			const discussionHandler = this.templateInstance.subscribe(
				'discussionsByStandardId', this.standardId()
			);

			this._subsHandlers.discussionHandler = discussionHandler;
		},
		function(){
			if( !this._subsHandlers.discussionHandler.ready() ){
				return;
			}

			const discussionIds = Discussions.find({}, { fields: {_id: 1} })
				.map((c) => {
					return c._id;
				});
			const messagesHandler = this.templateInstance.subscribe(
				'messagesByDiscussionIds', discussionIds
			)

			this._subsHandlers.messagesHandler = messagesHandler;
		},
		function(){
			this.isReady(
				_.values( this._subsHandlers() ).every( handle => handle.ready() )
			);
		}
	],

	isPageFound(){
		return this.isOrganisation() && this.isStandart();
	}
});
