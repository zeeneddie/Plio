import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.StandardsLayout.viewmodel({
  share: 'organization',
  autorun() {
    const orgSerialNumber = Number(FlowRouter.getParam('orgSerialNumber'));
    this.orgSerialNumber(orgSerialNumber);
  }
});
