import { Mongo } from 'meteor/mongo';

import { StandardsTypeSchema } from './standards-type-schema.js';


const StandardTypes = new Mongo.Collection('StandardTypes');
StandardTypes.attachSchema(StandardsTypeSchema);

export { StandardTypes };
