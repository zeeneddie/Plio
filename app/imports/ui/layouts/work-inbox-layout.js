import { Template } from 'meteor/templating';
import { OrgSubs, UserSubs, DocumentsListSubs } from '/imports/startup/client/subsmanagers.js';

Template.WorkInbox_Layout.viewmodel({
  mixin: ['organization', 'workInbox', 'nonconformity', 'risk'],
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
        DocumentsListSubs.subscribe('actionsList', _id),
        DocumentsListSubs.subscribe('nonConformitiesList', _id),
        DocumentsListSubs.subscribe('risksList', _id),
      ];

      // My deleted or Team deleated work items
      if (this.isActiveWorkInboxFilter(5) ||
          this.isActiveWorkInboxFilter(6)) {
        _subHandlers.push(DocumentsListSubs.subscribe('workItemsList', _id, true));
      } else {
        _subHandlers.push(DocumentsListSubs.subscribe('workItemsList', _id));
      }

      this._subHandlers(_subHandlers);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ]
});
