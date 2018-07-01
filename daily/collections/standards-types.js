import { Mongo } from 'meteor/mongo';

import { CollectionNames } from '../constants.js';
import { StandardsTypeSchema } from '../schemas/standards-type-schema.js';


const StandardTypes = new Mongo.Collection(CollectionNames.STANDARD_TYPES);
StandardTypes.attachSchema(StandardsTypeSchema);

StandardTypes.publicFields = {
  organizationId: 1,
  title: 1,
  abbreviation: 1,
  isDefault: 1,
  reservedTitle: 1,
};

export { StandardTypes };
