Template.UserMenu.events({
  'click a.logout-link'(e, tpl) {
    e.preventDefault();

    Meteor.logout(() => FlowRouter.go('signIn'));
  }
});
