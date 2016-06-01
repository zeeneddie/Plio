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
    optional: true
  },
  lastName: {
    type: String,
    optional: true
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
    type: String,
    optional: true
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
  }
});

const UserSchema = new SimpleSchema([UserProfileSchema]);

export { UserSchema, UserProfileSchema, PhoneNumberSchema };
