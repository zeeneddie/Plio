import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { OrgSubs, UserSubs } from '/imports/startup/client/subsmanagers.js';

Template.StandardDiscussionLayout.viewmodel({
	mixin: ['organization', 'standard'],
	//_subHandlers: [],
	_subHandlers: {},
	isOrganisation: true, // [ToDo] Check if the organisation exists?
	isReady: false,
	isStandart: true, // [ToDo] Check if the standart exists?

	autorun: [
		function(){
/*<<<<<<< HEAD
			const discussionHandler = this.templateInstance.subscribe(
				'discussionsByStandardId', this.standardId()
			);

			this._subsHandlers.discussionHandler = discussionHandler;
		},

		function(){
			this.isReady(
				_.values( this._subsHandlers() ).every( handle => handle.ready() )
			);
=======*/
			const standardId = this.standardId();
			const orgSerialNumber = this.organizationSerialNumber();
      const org = this.organization();
			const { _id, users } = !!org && org;
      const userIds = _.pluck(users, 'userId');

			/*const _subHandlers = [
				OrgSubs.subscribe('currentUserOrganizationBySerialNumber', orgSerialNumber),
        UserSubs.subscribe('organizationUsers', userIds),
				this.templateInstance.subscribe('discussionsByStandardId', standardId),
				//this.templateInstance.subscribe('messagesByStandardId', standardId),
				this.templateInstance.subscribe('standards-book-sections', _id),
        this.templateInstance.subscribe('standards-types', _id),
				this.templateInstance.subscribe('lessons', _id),
        this.templateInstance.subscribe('actions', _id),
        this.templateInstance.subscribe('nonConformities', _id),
        this.templateInstance.subscribe('risks', _id)
			];*/

			this._subHandlers.OrgSubs = OrgSubs.subscribe(
				'currentUserOrganizationBySerialNumber', orgSerialNumber
			);
			this._subHandlers.UserSubs = UserSubs.subscribe(
				'organizationUsers', userIds
			);
			this._subHandlers.discussionsByStandardId = this.templateInstance.subscribe(
				'discussionsByStandardId', standardId
			);
			this._subHandlers.standardsBookSections = this.templateInstance.subscribe(
				'standards-book-sections', _id
			);
			this._subHandlers.standardsTypes = this.templateInstance.subscribe(
				'standards-types', _id
			);
			this._subHandlers.lessons = this.templateInstance.subscribe(
				'lessons', _id
			);
			this._subHandlers.actions = this.templateInstance.subscribe(
				'actions', _id
			);
			this._subHandlers.nonConformities = this.templateInstance.subscribe(
				'nonConformities', _id
			);
			this._subHandlers.risks = this.templateInstance.subscribe('risks', _id);

			if (this.isActiveStandardFilter('deleted')) {
        //_subHandlers.push(this.templateInstance.subscribe('standardsDeleted', _id));
				this._subHandlers.standardsDeleted = this.templateInstance.subscribe(
					'standardsDeleted', _id
				);
      } else {
        //_subHandlers.push(this.templateInstance.subscribe('standards', _id));
				this._subHandlers.standards = this.templateInstance.subscribe(
					'standards', _id
				);
      }

			//this._subHandlers(_subHandlers);
		},
		function(){
			/*
			let _subHandlers = this._subHandlers.value;

			if( !_subHandlers[2] || !_subHandlers[2].ready() ){
				return;
			}

			const discussionIds = Discussions.find({}, { fields: {_id: 1} })
				.map((c) => {
					return c._id;
				});
			const messagesHandler = this.templateInstance.subscribe(
				'messagesByDiscussionIds', discussionIds
			)

			_subHandlers.push(messagesHandler);
			this._subHandlers(_subHandlers);
			*/

			if( !this._subHandlers.discussionsByStandardId.ready() ){
				return;
			}

			const discussionIds = Discussions.find({}, { fields: {_id: 1} })
				.map((c) => {
					return c._id;
				});

			this._subHandlers.messagesHandler = this.templateInstance.subscribe(
				'messagesByDiscussionIds', discussionIds
			);
		},
		function(){
			//this.isReady( this._subHandlers().every( handle => handle.ready() ) );
			const s = this._subHandlers();
			this.isReady(
				_.values( s ).every( handle => handle.ready() )
			);
			console.dir(s);
//>>>>>>> origin/devel
		}
	],

	isPageFound(){
		return this.isOrganisation() && this.isStandart();
	}
});
