import { Organizations } from '/imports/api/organizations/organizations.js';

Template.HelloPage.onCreated(function() {
  this.autorun(() => {
    if (Meteor.subscribe().ready() && Meteor.user()) {
      const { selectedOrganizationSerialNumber } = Meteor.user();
      if (selectedOrganizationSerialNumber) {
        FlowRouter.go('dashboardPage', { serialNumber: selectedOrganizationSerialNumber });
      } else {
        const { serialNumber } = Organizations.findOne();
        FlowRouter.go('dashboardPage', { serialNumber });
      }
    } else {
      FlowRouter.go('signIn');
    }
  });
});
