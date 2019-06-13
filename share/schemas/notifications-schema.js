import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { CreatedAtSchema } from './schemas';

const RequiredSchema = new SimpleSchema({
  recipientIds: {
    type: [String],
    index: 1,
  },
  title: {
    type: String,
  },
});

const NotificationsSchema = new SimpleSchema([
  CreatedAtSchema,
  RequiredSchema,
  {
    body: {
      type: String,
      optional: true,
    },
    icon: {
      type: SimpleSchema.RegEx.Url,
      optional: true,
    },
    url: {
      type: SimpleSchema.RegEx.Url,
      optional: true,
    },
    viewedBy: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
  },
]);

export { NotificationsSchema, RequiredSchema };
