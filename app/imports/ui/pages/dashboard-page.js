import { Organizations } from '/imports/api/organizations/organizations.js';

Template.DashboardPage.helpers({
  organization() {
    const serialNumber = FlowRouter.getParam('orgSerialNumber');
    return Organizations.findOne({ serialNumber });
  }
});
