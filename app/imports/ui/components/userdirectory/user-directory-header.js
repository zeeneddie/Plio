import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.UserDirectoryHeader.viewmodel({
  orgSerialNumber() {
    return FlowRouter.getParam('orgSerialNumber');
  }
});