Template.UserEdit.viewmodel({
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
  firstName() {
    return this.user().profile.firstName;
  },
  lastName() {
    return this.user().profile.lastName;
  },
  initials() {
    return this.user().initials();
  },
  email() {
    return this.user().email();
  },
  avatar() {
    return this.user().avatar();
  },
  description() {
    return this.user().description();
  },
  address() {
    return this.user().address();
  },
  country() {
    return this.user().country();
  },
  phones() {
    return this.user().phones();
  },
  skype() {
    return this.user().skype();
  }
});
