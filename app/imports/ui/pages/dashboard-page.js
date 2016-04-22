import { Organizations } from '/imports/api/organizations/organizations.js';

Template.DashboardPage.onCreated(function() {
  this.autorun(() => this.subscribe('currentUserOrganizations'));
});

Template.DashboardPage.helpers({
  organization() {
    const serialNumber = Number(FlowRouter.getParam('orgSerialNumber'));
    return Organizations.findOne({ serialNumber });
  }
});
