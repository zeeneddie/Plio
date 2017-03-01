import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { IdSchema, idSchemaDoc } from '/imports/share/schemas/schemas';

const idSchemaDefOpt = { ...idSchemaDoc, optional: true };

export const fileIdsSchema = new SimpleSchema({ fileIds: idSchemaDefOpt });
export const fileIds = new SimpleSchema({
  $addToSet: {
    optional: true,
    type: fileIdsSchema,
  },
  $pull: {
    optional: true,
    type: fileIdsSchema,
  },
});

export const improvementPlan = new SimpleSchema({
  $addToSet: {
    optional: true,
    type: new SimpleSchema({
      'improvementPlan.reviewDates': {
        optional: true,
        type: new SimpleSchema([
          IdSchema,
          {
            date: {
              type: Date,
            },
          },
        ]),
      },
      'improvementPlan.fileIds': idSchemaDefOpt,
    }),
  },
  $pull: {
    optional: true,
    type: new SimpleSchema({
      'improvementPlan.reviewDates': {
        type: IdSchema,
        optional: true,
      },
      'improvementPlan.fileIds': idSchemaDefOpt,
    }),
  },
});

const departmentIdsSchema = new SimpleSchema({ departmentsIds: idSchemaDefOpt });
export const departmentsIds = new SimpleSchema({
  $addToSet: {
    optional: true,
    type: departmentIdsSchema,
  },
  $pull: {
    optional: true,
    type: departmentIdsSchema,
  },
});

const notifySchema = new SimpleSchema({ notify: idSchemaDefOpt });
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

const standardIdsSchema = new SimpleSchema({ standardsIds: idSchemaDefOpt });
export const standardsIds = new SimpleSchema({
  $addToSet: {
    optional: true,
    type: standardIdsSchema,
  },
  $pull: {
    optional: true,
    type: standardIdsSchema,
  },
});
