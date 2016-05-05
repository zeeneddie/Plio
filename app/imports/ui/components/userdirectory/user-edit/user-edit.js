Template.UserEdit.viewmodel({
  mixin: ['organization'],
  guideHtml() {
    return `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Praesent vestibulum accumsan nulla, non pulvinar neque.
      Quisque faucibus tempor imperdiet. Suspendisse feugiat, nibh nec
      maximus pellentesque, massa nunc mattis ipsum, in dictum magna
      arcu et ipsum.</p>`;
  },
  user() {
    return Meteor.users.findOne({
      _id: this.userId()
    });
  },
  organizationId() {
    return this.organization()._id;
  },
  superpowersTitle() {
    const userName = this.user().firstName();
    const orgName = this.organization().name;
    return `${userName}'s superpowers for ${orgName}`;
  }
});
