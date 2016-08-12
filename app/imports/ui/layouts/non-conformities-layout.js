import { Template } from 'meteor/templating';
import { OrgSubs, UserSubs } from '/imports/startup/client/subsmanagers.js';

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
        this.templateInstance.subscribe('standards', _id),
        this.templateInstance.subscribe('lessons', _id),
        this.templateInstance.subscribe('departments', _id),
        this.templateInstance.subscribe('actions', _id),
        this.templateInstance.subscribe('risks', _id)
      ];

      if (this.isActiveNCFilter('deleted')) {
        _subHandlers.push(this.templateInstance.subscribe('nonConformities', _id, true));
      } else {
        _subHandlers.push(this.templateInstance.subscribe('nonConformities', _id));
      }

      this._subHandlers(_subHandlers);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ]
});
