import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.HelloPage.viewmodel({
  autorun() {
    const currentUser = Meteor.user();
    const organizationsHandle = this.templateInstance.subscribe('organizationsByUserId');
    if (!Meteor.loggingIn() && organizationsHandle.ready()) {
      if (currentUser) {
        const { selectedOrganizationSerialNumber } = currentUser;
        if (selectedOrganizationSerialNumber) {
          FlowRouter.go('dashboardPage', { orgSerialNumber: selectedOrganizationSerialNumber });
        } else {
          const { serialNumber } = Organizations.findOne({ 'users': { $elemMatch: { userId: currentUser._id, roles: 'owner' } } }) ||
                                    Organizations.findOne({ 'users.userId': currentUser._id });
          FlowRouter.go('dashboardPage', { orgSerialNumber: serialNumber });
        }
      } else {
        FlowRouter.go('signIn');
      }
    }
  }
});
