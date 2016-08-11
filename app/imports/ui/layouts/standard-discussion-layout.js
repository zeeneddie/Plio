import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { OrgSubs, UserSubs } from '/imports/startup/client/subsmanagers.js';

Template.StandardDiscussionLayout.viewmodel({
	mixin: ['organization', 'standard'],
	_subHandlers: [],
	isOrganisation: true, // [ToDo] Check if the organisation exists?
	isReady: false,
	isStandart: true, // [ToDo] Check if the standart exists?

	autorun: [
		function(){
			const standardId = this.standardId();
			const orgSerialNumber = this.organizationSerialNumber();
      const org = this.organization();
			const { _id, users } = !!org && org;
      const userIds = _.pluck(users, 'userId');

			const _subHandlers = [
				OrgSubs.subscribe('currentUserOrganizationBySerialNumber', orgSerialNumber),
        UserSubs.subscribe('organizationUsers', userIds),
				this.templateInstance.subscribe('discussionsByStandardId', standardId),
				this.templateInstance.subscribe('messagesByStandardId', standardId),
				this.templateInstance.subscribe('standards-book-sections', _id),
        this.templateInstance.subscribe('standards-types', _id),
				this.templateInstance.subscribe('lessons', _id),
        this.templateInstance.subscribe('actions', _id),
        this.templateInstance.subscribe('nonConformities', _id),
        this.templateInstance.subscribe('risks', _id)
			];

			if (this.isActiveStandardFilter('deleted')) {
        _subHandlers.push(this.templateInstance.subscribe('standardsDeleted', _id));
      } else {
        _subHandlers.push(this.templateInstance.subscribe('standards', _id));
      }

			this._subHandlers(_subHandlers);
		},
		function(){
			this.isReady( this._subHandlers().every( handle => handle.ready() ) );
		}
	],

	isPageFound(){
		return this.isOrganisation() && this.isStandart();
	}
});