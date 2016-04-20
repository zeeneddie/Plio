import { Mongo } from 'meteor/mongo';

import { StandardTypeSchema } from './standard-type-schema.js';


const StandardTypes = new Mongo.Collection('StandardTypes');
StandardTypes.attachSchema(StandardTypeSchema);

export { StandardTypes };
