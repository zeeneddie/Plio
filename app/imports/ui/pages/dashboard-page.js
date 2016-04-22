import { Organizations } from '/imports/api/organizations/organizations.js';

Template.DashboardPage.viewmodel({
  share: 'organization',
  autorun() {
    return this.templateInstance.subscribe('currentUserOrganizations');
  },
  onCreated() {
    const orgSerialNumber = Number(FlowRouter.getParam('orgSerialNumber'));
    this.orgSerialNumber(orgSerialNumber);
  },
  organization() {
    return Organizations.findOne({ serialNumber: this.orgSerialNumber() });
  }
});
