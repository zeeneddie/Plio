import { Mongo } from 'meteor/mongo';

import { CollectionNames } from '../constants.js';
import { OccurrencesSchema } from '../schemas/occurrences-schema.js';


const Occurrences = new Mongo.Collection(CollectionNames.OCCURRENCES);
Occurrences.attachSchema(OccurrencesSchema);


export { Occurrences };
