import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations';

Template.DashboardFooter.viewmodel({
  mixin: ['modal'],
  onInviteClick(event) {
    event.preventDefault();
    let orgSerialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'));
    let organizationId = Organizations.findOne({serialNumber: orgSerialNumber})._id;
    this.modal().open({
      template: 'UserDirectory_InviteUsers',
      title: 'Invite users',
      submitCaption: 'Invite',
      variation: 'save',
      organizationId
    });
  }
});