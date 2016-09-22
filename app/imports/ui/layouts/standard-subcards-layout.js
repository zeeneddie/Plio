import { Template } from 'meteor/templating';
import { DocumentsListSubs } from '/imports/startup/client/subsmanagers.js';

Template.StandardSubcardsLayout.viewmodel({
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
        this.templateInstance.subscribe('currentUserOrganizationBySerialNumber', orgSerialNumber),
        this.templateInstance.subscribe('organizationUsers', userIds),
        DocumentsListSubs.subscribe('standardsList', _id),
        this.templateInstance.subscribe('departments', _id),
        DocumentsListSubs.subscribe('risksList', _id)
      ];

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
