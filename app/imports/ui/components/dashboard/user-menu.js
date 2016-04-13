Template.UserMenu.events({
  'click a.logout-link': function(e, tpl) {
    e.preventDefault();

    Meteor.logout(() => {
      FlowRouter.go('signIn');
    });
  }
});
