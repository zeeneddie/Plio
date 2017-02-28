import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { StandardsSchema } from '/imports/share/schemas/standards-schema';
import { getSchemaFrom } from '../../../schema-helpers';
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
  'departmentsIds',
  'notify',
];

const getExtra = (key) => (key.includes('$') ? {} : { optional: true });

export const UpdateSchema = getSchemaFrom(StandardsSchema, getExtra)(lookup);

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
  schemas.notify,
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
