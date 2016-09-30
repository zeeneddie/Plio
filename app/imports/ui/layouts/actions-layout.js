import { Template } from 'meteor/templating';
import { OrgSubs, UserSubs, DocumentsListSubs } from '/imports/startup/client/subsmanagers.js';

Template.ActionsLayout.viewmodel({
  mixin: ['organization', 'workInbox'],
  _subHandlers: [],
  isReady: false,
  autorun: [
    function() {
      const orgSerialNumber = this.organizationSerialNumber();
      const org = this.organization();
      const { _id, users } = !!org && org;
      const userIds = _.pluck(users, 'userId');
      const _subHandlers = [
        OrgSubs.subscribe('currentUserOrganizationBySerialNumber', orgSerialNumber),
        UserSubs.subscribe('organizationUsers', userIds),
        DocumentsListSubs.subscribe('nonConformitiesList', _id),
        DocumentsListSubs.subscribe('risksList', _id)
      ];

      if (this.isActiveWorkInboxFilter('Deleted actions')) {
        _subHandlers.push(this.templateInstance.subscribe('actionsList', _id, true));
      } else {
        _subHandlers.push(this.templateInstance.subscribe('actionsList', _id));
      }

      this._subHandlers(_subHandlers);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ]
});
