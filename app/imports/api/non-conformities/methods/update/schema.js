import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { NonConformitiesSchema } from '/imports/share/schemas/non-conformities-schema';
import * as schemas from '../../../update-schemas';

const lookup = [
  'title',
  'description',
  'statusComment',
  'originatorId',
  'ownerId',
  'cost',
  'ref',
  'improvementPlan',
  'rootCauseAnalysis',
];
const UpdateSchema = schemas.getSchemaFrom(
  NonConformitiesSchema,
  schemas.withOptionalIfNotNested,
)(lookup);

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
  schemas.projectIds,
  schemas.notify,
  schemas.standardsIds,
  schemas.fileIds,
]);

export const MongoSchema = schemas.getMongoUpdateSchema(ModifierSchema);

export default new SimpleSchema([UpdateSchema, MongoSchema]);
