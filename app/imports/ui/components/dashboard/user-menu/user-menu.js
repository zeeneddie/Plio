import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { UserPresence } from 'meteor/konecty:user-presence';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';

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
  share: 'window',
  mixin: ['user', 'modal', 'organization', 'roles', 'mobile'],
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
      submitCaptionOnSave: 'Inviting...',
      closeCaption: 'Cancel',
      variation: 'save',
      organizationId
    });
  },
  goToMyProfile(e) {
    e.preventDefault();

    if ($(window).width() < 768) {
      this.width($(window).width());
    }

    FlowRouter.go('userDirectoryUserPage', { orgSerialNumber: this.orgSerialNumber(), userId: Meteor.userId() });
  },
  logout(e) {
    e.preventDefault();

    Meteor.logout(() => FlowRouter.go('signIn'));
  },
  openUserPreferences(e) {
    e.preventDefault();

    this.modal().open({
      template: 'UserPreferences',
      title: 'My preferences',
      userId: Meteor.userId()
    });
  }
});
