import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { PhoneTypes } from '../constants.js';


const PhoneNumberSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  number: {
    type: String,
    regEx: /^[\+|0-9][0-9\-\s\(\)]+$/
  },
  type: {
    type: String,
    allowedValues: _.values(PhoneTypes)
  }
});

const UserProfileSchema = new SimpleSchema({
  firstName: {
    type: String,
    min: 2
  },
  lastName: {
    type: String,
    min: 2
  },
  initials: {
    type: String,
    min: 2,
    max: 3,
    optional: true
  },
  description: {
    type: String,
    optional: true
  },
  avatar: {
    type: String
  },
  skype: {
    type: String,
    optional: true
  },
  country: {
    type: String,
    optional: true
  },
  address: {
    type: String,
    optional: true
  },
  phoneNumbers: {
    type: [PhoneNumberSchema],
    optional: true
  },
  organizationName: {
    type: String,
    optional: true
  }
});

const UserPreferencesSchema = new SimpleSchema({
  areNotificationsEnabled: {
    type: Boolean,
    defaultValue: true
  },
  notificationSound: {
    type: String,
    optional: true
  }
});

const UserEmailSchema = new SimpleSchema({
  address: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  verified: {
    type: Boolean,
    defaultValue: false
  }
});

const UserSchema = new SimpleSchema({
  createdAt: {
    type: Date
  },
  services: {
    type: Object,
    blackbox: true
  },
  emails: {
    type: [UserEmailSchema]
  },
  profile: {
    type: UserProfileSchema
  },
  status: {
    type: String,
    optional: true
  },
  statusConnection: {
    type: String,
    optional: true
  },
  roles: {
    type: Object,
    blackbox: true,
    optional: true
  },
  preferences: {
    type: UserPreferencesSchema
  },
  invitationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  invitedAt: {
    type: Date,
    optional: true
  },
  invitedBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  invitationExpirationDate: {
    type: Date,
    optional: true
  },
});

export { UserSchema, UserProfileSchema, PhoneNumberSchema };
