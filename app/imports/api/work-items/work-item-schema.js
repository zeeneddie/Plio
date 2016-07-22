import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, ViewedBySchema } from '../schemas.js';
import { WorkItemTypes, WorkItemLinkedDocTypes, WorkItemStatuses } from '../constants.js';

const linkedDocSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  type: {
    type: String,
    allowedValues: _.values(WorkItemLinkedDocTypes)
  }
});

const WorkItemsSchema = new SimpleSchema([
  BaseEntitySchema,
  ViewedBySchema,
  {
    linkedDoc: {
      type: linkedDocSchema
    },
    type: {
      type: String,
      allowedValues: _.values(WorkItemTypes)
    },
    status: {
      type: Number,
      allowedValues: _.keys(WorkItemStatuses).map(status => parseInt(status, 10))
    },
    assigneeId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }
]);

export { WorkItemsSchema };
