import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.HelloPage.viewmodel({
  mixin: 'router',
  onCreated(template) {
    template.autorun(() => {
      const currentUser = Meteor.user();
      const organizationsHandle = template.subscribe('currentUserOrganizations');
      if (!Meteor.loggingIn() && organizationsHandle.ready()) {
        if (currentUser) {
          if (Organizations.find({ 'users.userId': currentUser._id })) {
            // if the user is an owner of organization go to that organization no matter what
            const ownerOrg = Organizations.findOne({ 'users': { $elemMatch: { userId: currentUser._id, role: 'owner' } } });
            if (!!ownerOrg) {
              this.goToDashboard(ownerOrg.serialNumber);
            } else {
              const { selectedOrganizationSerialNumber } = currentUser;
              const orgExists = !!Organizations.findOne({ serialNumber: selectedOrganizationSerialNumber });
              if (selectedOrganizationSerialNumber && orgExists) {
                this.goToDashboard(selectedOrganizationSerialNumber);
              } else {
                const org = Organizations.findOne({ 'users.userId': currentUser._id });
                !!org && this.goToDashboard(org.serialNumber);
              }
            }
          }
        } else {
          FlowRouter.go('signIn');
        }
      }
    });
  }
});
