import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { CreatedAtSchema, ViewedBySchema } from '../schemas.js';

const RequiredSchema = new SimpleSchema({
  recipientIds: {
    type: [String]
  },
  subject: {
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

// db.Notifications.insert({ recipientIds: ['SQHmBKJ94gJvpLKLt'], createdAt: new Date, viewedBy: [], title: 'Hello World!', body: 'Lorem ipsum dolor amet' })

export { NotificationsSchema, RequiredSchema };
