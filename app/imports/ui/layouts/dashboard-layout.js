import { Template } from 'meteor/templating';

Template.DashboardLayout.viewmodel({
  share: 'organization',
  autorun() {
    const orgSerialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'));
    this.orgSerialNumber(orgSerialNumber);
  }
});
