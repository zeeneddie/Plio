import { Template } from 'meteor/templating';
import { OrgSubs, UserSubs, DocumentsListSubs } from '/imports/startup/client/subsmanagers.js';

Template.NC_Layout.viewmodel({
  mixin: ['organization', 'nonconformity'],
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
        DocumentsListSubs.subscribe('standardsList', _id),
        DocumentsListSubs.subscribe('risksList', _id),
        this.templateInstance.subscribe('departments', _id),
      ];

      // this.isActiveNCFilter(4) is true if deleted filter is active
      if (this.isActiveNCFilter(4)) {
        _subHandlers.push(DocumentsListSubs.subscribe('nonConformitiesList', _id, true));
      } else {
        _subHandlers.push(DocumentsListSubs.subscribe('nonConformitiesList', _id));
      }

      this._subHandlers(_subHandlers);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ]
});
