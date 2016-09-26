import { Mongo } from 'meteor/mongo';

import { OccurrencesSchema } from '../schemas/occurrences-schema.js';


const Occurrences = new Mongo.Collection('Occurrences');
Occurrences.attachSchema(OccurrencesSchema);


export { Occurrences };
