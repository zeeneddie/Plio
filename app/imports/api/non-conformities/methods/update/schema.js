import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { NonConformitiesSchema } from '/imports/share/schemas/non-conformities-schema';
import { getSchemaFrom } from '../../../schema-helpers';
import * as schemas from '../../../update-schemas';

const lookup = [
  'title',
  'description',
  'statusComment',
  'identifiedBy',
  'identifiedAt',
  'magnitude',
  'cost',
  'ref',
  'improvementPlan',
  'rootCauseAnalysis',
];
const getExtra = key => (key.includes('$') ? {} : { optional: true });

const UpdateSchema = getSchemaFrom(NonConformitiesSchema, getExtra)(lookup);

const CauseSchema = new SimpleSchema({
  index: {
    type: Number,
  },
  text: {
    type: String,
  },
});

export const modifierSchemaDefinition = {
  $set: {
    type: UpdateSchema,
    optional: true,
  },
  $addToSet: {
    optional: true,
    type: new SimpleSchema({
      rootCauseAnalysis: {
        optional: true,
        type: new SimpleSchema([schemas.fileIdsSchema, {
          causes: {
            type: CauseSchema,
            optional: true,
          },
        }]),
      },
    }),
  },
  $pull: {
    optional: true,
    type: new SimpleSchema({
      rootCauseAnalysis: {
        optional: true,
        type: new SimpleSchema([schemas.fileIdsSchema, {
          causes: {
            type: CauseSchema.pick(['index']),
            optional: true,
          },
        }]),
      },
    }),
  },
};

export const ModifierSchema = new SimpleSchema([
  modifierSchemaDefinition,
  schemas.improvementPlan,
  schemas.departmentsIds,
  schemas.notify,
  schemas.standardsIds,
  schemas.fileIds,
]);

export const MongoSchema = new SimpleSchema({
  options: {
    type: ModifierSchema,
    optional: true,
  },
  query: {
    type: Object,
    optional: true,
    blackbox: true,
  },
});

export default new SimpleSchema([UpdateSchema, MongoSchema]);
