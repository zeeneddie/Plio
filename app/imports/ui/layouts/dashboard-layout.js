import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { OrgSubs, UserSubs, OrgSettingsDocSubs } from '/imports/startup/client/subsmanagers.js';

Template.Dashboard_Layout.viewmodel({
  mixin: 'organization',
  isReady: false,
  _subHandlers: [],
  autorun: [
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    },
    function() {
      const { _id, users } = !!this.organization() && this.organization();
      const userIds = _.pluck(users, 'userId');
      this._subHandlers([
        OrgSubs.subscribe('currentUserOrganizationById', _id)
      ]);

      // We need to fetch and chache these documents in background to decrease the loading time of other screens
      UserSubs.subscribe('organizationUsers', userIds);
      OrgSettingsDocSubs.subscribe('standards-book-sections', _id);
      OrgSettingsDocSubs.subscribe('standards-types', _id);
      OrgSettingsDocSubs.subscribe('riskTypes', _id);
      OrgSettingsDocSubs.subscribe('departments', _id);
    }
  ]
});
