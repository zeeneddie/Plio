import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { IdSchema } from '/imports/share/schemas/schemas';

export const improvementPlan = new SimpleSchema({
  $addToSet: {
    optional: true,
    type: new SimpleSchema({
      'improvementPlan.reviewDates': {
        type: new SimpleSchema([
          IdSchema,
          {
            date: {
              type: Date,
            },
          },
        ]),
        optional: true,
      },
    }),
  },
  $pull: {
    optional: true,
    type: new SimpleSchema({
      'improvementPlan.reviewDates': {
        type: IdSchema,
        optional: true,
      },
    }),
  },
});

const departmentsIdsSchema = new SimpleSchema({
  departmentsIds: {
    type: String,
    optional: true,
  },
});

export const departmentsIds = new SimpleSchema({
  $addToSet: {
    optional: true,
    type: departmentsIdsSchema,
  },
  $pull: {
    optional: true,
    type: departmentsIdsSchema,
  },
});

const notifySchema = new SimpleSchema({
  notify: {
    optional: true,
    type: String,
  },
});

export const notify = new SimpleSchema({
  $addToSet: {
    optional: true,
    type: notifySchema,
  },
  $pull: {
    optional: true,
    type: notifySchema,
  },
});
