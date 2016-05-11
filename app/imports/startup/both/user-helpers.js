Meteor.users.helpers({
  fullName() {
    const { firstName='', lastName='' } = this.profile;
    return `${firstName} ${lastName}`;
  },
  firstName() {
    return this.profile.firstName;
  },
  lastName() {
    return this.profile.lastName;
  },
  initials() {
    return this.profile.initials;
  },
  email() {
    return this.emails[0].address;
  },
  avatar() {
    return this.profile.avatar;
  },
  description() {
    return this.profile.description;
  },
  address() {
    return this.profile.address;
  },
  country() {
    return this.profile.country;
  },
  phoneNumbers() {
    return this.profile.phoneNumbers;
  },
  skype() {
    return this.profile.skype;
  }
});
