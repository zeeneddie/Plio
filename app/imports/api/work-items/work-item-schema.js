import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, ViewedBySchema, OrganizationIdSchema, DeletedSchema } from '../schemas.js';
import { WorkItemsStore } from '../constants.js';

const { TYPES, LINKED_TYPES, STATUSES } = WorkItemsStore;

const linkedDocSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  type: {
    type: String,
    allowedValues: _.values(LINKED_TYPES)
  }
});

const WorkItemsSchema = new SimpleSchema([
  BaseEntitySchema,
  ViewedBySchema,
  OrganizationIdSchema,
  DeletedSchema,
  {
    targetDate: {
      type: Date
    },
    linkedDoc: {
      type: linkedDocSchema
    },
    type: {
      type: String,
      allowedValues: _.values(TYPES)
    },
    status: {
      type: Number,
      allowedValues: _.keys(STATUSES).map(status => parseInt(status, 10))
    },
    assigneeId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    isCompleted: {
      type: Boolean,
      defaultValue: false
    }
  }
]);

export { WorkItemsSchema };
