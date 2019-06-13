import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { BaseEntitySchema, ViewedBySchema, OrganizationIdSchema, DeletedSchema } from './schemas';
import { WorkItemsStore } from '../constants';

const { TYPES, LINKED_TYPES, STATUSES } = WorkItemsStore;

const linkedDocSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    index: 1,
  },
  type: {
    type: String,
    allowedValues: _.values(LINKED_TYPES),
  },
});

const WorkItemsSchema = new SimpleSchema([
  BaseEntitySchema,
  ViewedBySchema,
  OrganizationIdSchema,
  DeletedSchema,
  {
    targetDate: {
      type: Date,
      optional: true,
    },
    linkedDoc: {
      type: linkedDocSchema,
    },
    type: {
      type: String,
      allowedValues: _.values(TYPES),
    },
    status: {
      type: Number,
      allowedValues: _.keys(STATUSES).map(status => parseInt(status, 10)),
      defaultValue: 0,
      optional: true,
    },
    assigneeId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    isCompleted: {
      type: Boolean,
      defaultValue: false,
    },
    completedAt: {
      type: Date,
      optional: true,
      autoValue() {
        const isCompleted = this.field('isCompleted');
        if (this.isUpdate && isCompleted.isSet && !!isCompleted.value) {
          return new Date();
        }
        return this.unset();
      },
    },
  },
]);

export { WorkItemsSchema };
