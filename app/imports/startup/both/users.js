import { Meteor } from 'meteor/meteor';
import { UserSchema } from '/imports/share/schemas/user-schema.js';
import { _ } from 'meteor/underscore';

Meteor.users.attachSchema(UserSchema);

Meteor.users.helpers({
  fullName() {
    const { firstName = '', lastName = '' } = this.profile;

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }

    return null;
  },
  fullNameOrEmail() {
    return this.fullName() || this.email();
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
  formattedAddress() {
    let address = this.address() || '';

    // get rid of trailling '\n'
    address = address.trim();

    // if address does not include '\n',
    // return it without changes
    let parts = address.split('\n');
    if (parts.length === 1) {
      return parts[0];
    }

    // remove address parts that does not include words or numbers
    parts = _.filter(parts, part => part.search(/[a-z0-9]/i) > -1);

    // join address parts with commas
    let addressString = _.map(parts, part => part.replace(/,\s*$/, '').trim()).join(', ');

    // add trailing '.' if needed
    addressString = addressString.slice(-1) === '.' ? addressString : `${addressString}.`;
    return addressString;
  },
  country() {
    return this.profile.country;
  },
  phoneNumbers() {
    return this.profile.phoneNumbers;
  },
  skype() {
    return this.profile.skype;
  },
  hasVerifiedEmail() {
    return this.emails[0].verified;
  },
  hasAcceptedInvite() {
    return !this.invitationId && !this.invitationExpirationDate;
  },
  areNotificationsEnabled() {
    return this.preferences && this.preferences.areNotificationsEnabled;
  },
});

Meteor.users.publicFields = {
  _id: 1,
  'emails.address': 1,
  'emails.verified': 1,
  'profile.address': 1,
  'profile.avatar': 1,
  'profile.country': 1,
  'profile.description': 1,
  'profile.firstName': 1,
  'profile.lastName': 1,
  'profile.initials': 1,
  'profile.phoneNumbers': 1,
  'profile.skype': 1,
  status: 1,
  statusConnection: 1,
};
