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

Template.UserMenu.helpers({
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
  }
});

Template.UserMenu.events({
  'click a.logout-link': function (e, tpl) {
    e.preventDefault();

    Meteor.logout(() => {
      FlowRouter.go('signIn');
    });
  },

  'click a.js-status': function (e, tpl) {
    e.preventDefault();

    const status = $(e.target).text().trim().toLowerCase();
    if (status != Meteor.user().statusDefault) {
      Meteor.call('UserPresence:setDefaultStatus', status);
    }
  }
});
