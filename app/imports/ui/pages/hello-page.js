import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.HelloPage.viewmodel({
  autorun() {
    const currentUser = Meteor.user();
    const organizationsHandle = this.templateInstance.subscribe('currentUserOrganizations');
    if (!Meteor.loggingIn() && organizationsHandle.ready()) {
      if (currentUser) {
        // if the user is an owner of organization go to that organization no matter what
        const ownerOrg = Organizations.findOne({ 'users': { $elemMatch: { userId: currentUser._id, role: 'owner' } } });
        if (ownerOrg) {
          this.routeToDashboard(ownerOrg);
        } else {
          const { selectedOrganizationSerialNumber } = currentUser;
          if (selectedOrganizationSerialNumber) {
            FlowRouter.go('dashboardPage', { orgSerialNumber: selectedOrganizationSerialNumber });
          } else {
            const org = Organizations.findOne({ 'users.userId': currentUser._id });
            this.routeToDashboard(org);
          }
        }
      } else {
        FlowRouter.go('signIn');
      }
    }
  },
  routeToDashboard(doc) {
    const { serialNumber } = doc;
    FlowRouter.go('dashboardPage', { orgSerialNumber: serialNumber });
  }
});
