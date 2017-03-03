import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { MessageTypes } from '../constants';

import {
  BaseEntitySchema,
  DiscussionIdSchema,
  OrganizationIdSchema,
} from './schemas';


export const MessagesSchema = new SimpleSchema([
  BaseEntitySchema,
  DiscussionIdSchema,
  OrganizationIdSchema,
  {
    text: {
      type: String,
      max: 140,
      optional: true,
    },
    fileId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },

    type: {
      type: String,
      allowedValues: Object.values(MessageTypes),
    },
  },
]);
