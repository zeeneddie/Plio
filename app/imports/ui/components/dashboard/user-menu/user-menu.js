import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { UserPresence } from 'meteor/konecty:user-presence';
import { Roles } from 'meteor/alanning:roles';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { UserRoles } from '/imports/api/constants.js';

const STATUSES = [
  {
    text: 'Online',
    css: 'text-success',
    status: 'online'
  },
  {
    text: 'Away',
    css: 'text-warning',
    status: 'away'
  },
  {
    text: 'Offline',
    css: 'text-danger',
    status: 'offline'
  }
];

Template.UserMenu.viewmodel({
  mixin: ['user', 'modal', 'organization'],
  organizationId() {
    return this.organization() && this.organization()._id;
  },
  canInviteUsers() {
    return Roles.userIsInRole(
      Meteor.userId(),
      UserRoles.INVITE_USERS,
      this.organizationId()
    );
  },
  getStatuses() {
    return STATUSES;
  },
  isActiveStatus(index) {
    const user = Meteor.user();
    const currentStatus = STATUSES[index].text.toLowerCase();
    const statusDefault = user.statusDefault;

    return currentStatus === statusDefault;
  },
  getActiveClass() {
    const user = Meteor.user();
    const userStatus = user.status;
    const activeStatus = STATUSES.find((status) => {
      return status.text.toLowerCase() === userStatus;
    });

    return (activeStatus && activeStatus.css) || STATUSES[0].css;
  },
  orgSerialNumber() {
    return FlowRouter.getParam('orgSerialNumber');
  },
  changeStatus(e) {
    e.preventDefault();

    const status = $(e.target).text().trim().toLowerCase();
    if (status != Meteor.user().statusDefault) {
      Meteor.call('UserPresence:setDefaultStatus', status);
    }
  },
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
  },
  logout(e) {
    e.preventDefault();

    Meteor.logout(() => FlowRouter.go('signIn'));
  }
});
