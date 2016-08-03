import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';


Template.StandardDiscussionLayout.viewmodel({
	mixin: ['organization', 'standard'],
	_subsHandlers: [],
	isOrganisation: true, // [ToDo] Check if the organisation exists?
	isReady: false,
	isStandart: true, // [ToDo] Check if the standart exists?

	autorun: [
		function(){
			const _subsHandlers = [
				this.templateInstance.subscribe('discussionsByStandart', this.standardId() )
			];

			this._subsHandlers(_subsHandlers);
		},
		function(){
			this.isReady( this._subsHandlers().every( handle => handle.ready() ) );
		}
	],

	isPageFound(){
		return this.isOrganisation() && this.isStandart();
	}
});
