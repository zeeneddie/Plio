import { Template } from 'meteor/templating';
import { OrgSubs, UserSubs, DocumentsListSubs, OrgSettingsDocSubs } from '/imports/startup/client/subsmanagers.js';

Template.Risks_Layout.viewmodel({
  mixin: ['organization', 'risk'],
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
        OrgSettingsDocSubs.subscribe('departments', _id),
        OrgSettingsDocSubs.subscribe('riskTypes', _id),
        DocumentsListSubs.subscribe('nonConformitiesList', _id)
      ];

      if (this.isActiveRiskFilter(4)) {
        _subHandlers.push(DocumentsListSubs.subscribe('risksList', _id, true));
      } else {
        _subHandlers.push(DocumentsListSubs.subscribe('risksList', _id));
      }

      this._subHandlers(_subHandlers);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ]
});
