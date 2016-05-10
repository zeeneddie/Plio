import { Template } from 'meteor/templating';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.DashboardPage.viewmodel({
  mixin: 'organization',
  autorun() {
    this.templateInstance.subscribe('currentUserOrganizations');
  }
});
