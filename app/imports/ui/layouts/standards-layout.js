import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.StandardsLayout.viewmodel({
  mixin: 'organization',
  autorun() {
    this.templateInstance.subscribe('currentUserOrganizations');
    if (this.organization()) {
      const { _id, users } = this.organization();
      const userIds = _.pluck(users, 'userId');
      this.templateInstance.subscribe('standards-book-sections', _id);
      this.templateInstance.subscribe('standards-types', _id);
      this.templateInstance.subscribe('standards', _id);
      this.templateInstance.subscribe('departments', _id);
      this.templateInstance.subscribe('organizationUsers', userIds);
    }
  }
});
