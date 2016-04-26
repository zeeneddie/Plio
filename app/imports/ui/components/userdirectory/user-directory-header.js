import { Template } from 'meteor/templating';

Template.UserDirectoryHeader.viewmodel({
  orgSerialNumber() {
    return FlowRouter.getParam('orgSerialNumber');
  }
});