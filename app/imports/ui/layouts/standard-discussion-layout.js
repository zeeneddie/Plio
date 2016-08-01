import { Template } from 'meteor/templating';


Template.StandardDiscussionLayout.viewmodel({
	isOrganisation: true,
	isReady: true,
	isStandart: true,

	isPageFound(){
		return this.isOrganisation() && this.isStandart();
	},

	mixin: ['organization', 'standard']
});
