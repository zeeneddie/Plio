import { Mongo } from 'meteor/mongo';

import { StandardsTypeSchema } from './standards-type-schema.js';


const StandardsTypes = new Mongo.Collection('StandardsTypes');
StandardsTypes.attachSchema(StandardsTypeSchema);

export { StandardsTypes };
