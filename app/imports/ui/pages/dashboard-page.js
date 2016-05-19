import { Template } from 'meteor/templating';

import { Organizations } from '/imports/api/organizations/organizations.js';
import Counter from '/imports/api/counter/client.js';

Template.DashboardPage.viewmodel({
  mixin: 'organization',
  autorun() {
    this.templateInstance.subscribe('organization-standards-count', this.organization()._id);
    console.log(Counter.get('organization-standards-count'));
  }
});
