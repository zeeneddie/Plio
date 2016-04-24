import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { UserRoles } from '/imports/api/constants.js';


const orgUserSchema = new SimpleSchema({
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  role: {
    type: String,
    allowedValues: _.values(UserRoles)
  }
});

export const OrganizationSchema = new SimpleSchema({
  serialNumber: {
    type: Number,
    min: 100
  },
  name: {
    type: String,
    min: 1,
    max: 40
  },
  users: {
    type: [orgUserSchema],
    minCount: 1
  }
});
