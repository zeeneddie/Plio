import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.UserMenu.events({
  'click a.logout-link'(e, tpl) {
    e.preventDefault();

    Meteor.logout(() => FlowRouter.go('signIn'));
  }
});
