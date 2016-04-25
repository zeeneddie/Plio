import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { Organizations } from '/imports/api/organizations/organizations.js';

Template.StandardsLayout.viewmodel({
  share: 'organization',
  autorun() {
    const orgSerialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'));
    this.orgSerialNumber(orgSerialNumber);
    this.templateInstance.subscribe('currentUserOrganizations');
  }
});
