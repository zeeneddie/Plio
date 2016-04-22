import { Template } from 'meteor/templating';

Template.StandardsLayout.viewmodel({
  share: 'organization',
  autorun() {
    const orgSerialNumber = Number(FlowRouter.getParam('orgSerialNumber'));
    this.orgSerialNumber(orgSerialNumber);
  }
});
