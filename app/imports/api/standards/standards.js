import { Mongo } from 'meteor/mongo';

import { StandardsSchema } from './standards-schema.js';

const Standards = new Mongo.Collection('standards');
Standards.attachSchema(StandardsSchema);

export { Standards };
