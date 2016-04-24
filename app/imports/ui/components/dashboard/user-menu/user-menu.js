import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { UserPresence } from 'meteor/konecty:user-presence';

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
  changeStatus(e) {
    e.preventDefault();

    const status = $(e.target).text().trim().toLowerCase();
    if (status != Meteor.user().statusDefault) {
      Meteor.call('UserPresence:setDefaultStatus', status);
    }
  },
  logout(e) {
    e.preventDefault();

    Meteor.logout(() => FlowRouter.go('signIn'));
  }
});
