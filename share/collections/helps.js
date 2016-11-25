import { Mongo } from 'meteor/mongo';

import { HelpSchema } from '../schemas/help-schema.js';
import { CollectionNames } from '../constants';


const Helps = new Mongo.Collection(CollectionNames.HELPS);

Helps.attachSchema(HelpSchema);

export { Helps };
