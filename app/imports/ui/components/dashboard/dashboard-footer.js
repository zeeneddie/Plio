import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations';

Template.DashboardFooter.viewmodel({
  onInviteClick(event) {
    event.preventDefault();
    let orgSerialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'));
    let organizationId = Organizations.findOne({serialNumber: orgSerialNumber})._id;
    ModalManager.open('UserDirectory_InviteUsers', {organizationId: organizationId});
  }
});