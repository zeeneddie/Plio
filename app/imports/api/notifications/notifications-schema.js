import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { CreatedAtSchema, ViewedBySchema } from '../schemas.js';

const RequiredSchema = new SimpleSchema({
  recipientIds: {
    type: [String]
  },
  title: {
    type: String
  }
});

const NotificationsSchema = new SimpleSchema([
  CreatedAtSchema,
  ViewedBySchema,
  RequiredSchema,
  {
    body: {
      type: String,
      optional: true
    },
    icon: {
      type: SimpleSchema.RegEx.Url,
      optional: true
    },
    url: {
      type: SimpleSchema.RegEx.Url,
      optional: true
    }
  }
]);

export { NotificationsSchema, RequiredSchema };
