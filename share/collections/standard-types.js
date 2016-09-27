import { Mongo } from 'meteor/mongo';

import { CollectionNames } from '../constants.js';
import { StandardsTypeSchema } from '../schemas/standard-types-schema.js';


const StandardTypes = new Mongo.Collection(CollectionNames.STANDARD_TYPES);
StandardTypes.attachSchema(StandardsTypeSchema);

export { StandardTypes };
