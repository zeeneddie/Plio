

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { StandardsSchema } from '/imports/share/schemas/standards-schema';
import * as schemas from '../../../update-schemas';

const lookup = [
  'improvementPlan',
  'source1',
  'source2',
  'title',
  'nestingLevel',
  'description',
  'sectionId',
  'typeId',
  'uniqueNumber',
  'owner',
  'issueNumber',
  'status',
];

export const UpdateSchema = schemas.getSchemaFrom(
  StandardsSchema,
  schemas.withOptionalIfNotNested,
)(lookup);

export const modifierSchemaDefinition = {
  $set: {
    type: UpdateSchema,
    optional: true,
  },
  $rename: {
    type: Object,
    optional: true,
  },
  '$rename.source2': {
    type: String,
    allowedValues: ['source1'],
  },
  $unset: {
    type: Object,
    optional: true,
  },
  '$unset.source1': {
    type: String,
    optional: true,
  },
  '$unset.source2': {
    type: String,
    optional: true,
  },
};

export const ModifierSchema = new SimpleSchema([
  modifierSchemaDefinition,
  schemas.improvementPlan,
  schemas.departmentsIds,
  schemas.projectIds,
  schemas.notify,
]);

export const MongoSchema = schemas.getMongoUpdateSchema(ModifierSchema);

export default new SimpleSchema([UpdateSchema, MongoSchema]);
