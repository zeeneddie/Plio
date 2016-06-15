import { Mongo } from 'meteor/mongo';

import { OccurencesSchema } from './occurences-schema.js';

const Occurences = new Mongo.Collection('Occurences');
Occurences.attachSchema(OccurencesSchema);

export { Occurences };
