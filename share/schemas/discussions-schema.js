import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { idSchemaDoc, BaseEntitySchema, OrganizationIdSchema } from './schemas.js';
import { DocumentTypes } from '../constants.js';

export const ViewedBySchema = new SimpleSchema({
  userId: idSchemaDoc,
  messageId: idSchemaDoc,
  viewedUpTo: {
    type: Date,
  },
});

export const DiscussionsSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  {
    documentType: {
      type: String,
      allowedValues: _.values(DocumentTypes),
    },
    linkedTo: idSchemaDoc,
    startedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    startedAt: {
      type: Date,
      optional: true,
    },
    isPrimary: {
      type: Boolean,
      defaultValue: false,
    },
    isStarted: {
      type: Boolean,
      defaultValue: false,
    },
    viewedBy: {
      type: [ViewedBySchema],
      optional: true,
    },
    participants: {
      type: [idSchemaDoc],
      optional: true,
      defaultValue: [],
    },
  },
]);
