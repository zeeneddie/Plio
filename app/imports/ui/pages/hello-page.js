import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';

const routeToDashboard = (doc) => {
  const { serialNumber } = doc;
  FlowRouter.go('dashboardPage', { orgSerialNumber: serialNumber });
};

Template.HelloPage.onCreated(function() {
  this.autorun(() => {
    const currentUser = Meteor.user();
    const organizationsHandle = this.subscribe('currentUserOrganizations');
    if (!Meteor.loggingIn() && organizationsHandle.ready()) {
      if (currentUser) {
        // if the user is an owner of organization go to that organization no matter what
        const ownerOrg = Organizations.findOne({ 'users': { $elemMatch: { userId: currentUser._id, role: 'owner' } } });
        if (ownerOrg) {
          routeToDashboard(ownerOrg);
        } else {
          const { selectedOrganizationSerialNumber } = currentUser;
          if (selectedOrganizationSerialNumber) {
            FlowRouter.go('dashboardPage', { orgSerialNumber: selectedOrganizationSerialNumber });
          } else {
            const org = Organizations.findOne({ 'users.userId': currentUser._id });
            routeToDashboard(org);
          }
        }
      } else {
        FlowRouter.go('signIn');
      }
    }
  });
});
