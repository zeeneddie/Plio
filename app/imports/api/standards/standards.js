import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { StandardsSchema } from './standards-schema.js';
import { CollectionNames } from '../constants.js';


const Standards = new Mongo.Collection(CollectionNames.STANDARDS);
Standards.attachSchema(StandardsSchema);


export { Standards };
