import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';
import { Organizations } from '/imports/api/organizations/organizations.js';

Template.StandardsLayout.viewmodel({
  share: 'organization',
  autorun() {
    const orgSerialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'));
    this.orgSerialNumber(orgSerialNumber);
    this.templateInstance.subscribe('currentUserOrganizations');
    const org = Organizations.findOne({ serialNumber: this.orgSerialNumber() });
    const { _id, users } = !!org && org;
    const userIds = _.pluck(users, 'userId');
    this.templateInstance.subscribe('standards-book-sections', _id);
    this.templateInstance.subscribe('standards-types', _id);
  }
});
