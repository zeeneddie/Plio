import { SimpleSchema } from 'meteor/aldeed:simple-schema';


const UserProfile = new SimpleSchema({
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
  }
});

const UserSchema = new SimpleSchema([UserProfile]);

export { UserSchema, UserProfile };
