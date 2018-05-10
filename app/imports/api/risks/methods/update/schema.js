import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { RisksSchema } from '/imports/share/schemas/risks-schema';
import * as schemas from '../../../update-schemas';

const lookup = [
  'title',
  'description',
  'statusComment',
  'originatorId',
  'ownerId',
  'type',
  'improvementPlan',
  'riskEvaluation',
];

const UpdateSchema = schemas.getSchemaFrom(
  RisksSchema,
  schemas.withOptionalIfNotNested,
)(lookup);

export const modifierSchemaDefinition = {
  $set: {
    type: UpdateSchema,
    optional: true,
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

export const MongoSchema = schemas.getMongoUpdateSchema(ModifierSchema);

export default new SimpleSchema([UpdateSchema, MongoSchema]);
