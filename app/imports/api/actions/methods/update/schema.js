import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { ActionSchema } from '/imports/share/schemas/action-schema';
import * as schemas from '../../../update-schemas';

const lookup = [
  'title',
  'description',
  'ownerId',
  'planInPlace',
  'notes',
  'completedAt',
  'completedBy',
  'completionComments',
  'verifiedAt',
  'verifiedBy',
  'verificationComments',
];

export const UpdateSchema = schemas.getSchemaFrom(
  ActionSchema,
  schemas.withOptionalIfNotNested,
)(lookup);

export const ModifierSchema = new SimpleSchema([
  schemas.notify,
  schemas.fileIds,
]);

export const MongoSchema = schemas.getMongoUpdateSchema(ModifierSchema);

export default new SimpleSchema([UpdateSchema, MongoSchema]);
