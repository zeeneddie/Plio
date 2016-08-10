import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { OrgSubs } from '/imports/startup/client/subsmanagers.js';

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
        OrgSubs.subscribe('currentUserOrganizationById', _id),
      ]);
    }
  ]
});
