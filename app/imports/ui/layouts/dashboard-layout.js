import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';


Template.DashboardLayout.viewmodel({
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
        this.templateInstance.subscribe('currentUserOrganizationById', _id),
        this.templateInstance.subscribe('organizationUsers', userIds)
      ]);
    }
  ]
});
