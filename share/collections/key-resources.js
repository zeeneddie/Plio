import { Mongo } from 'meteor/mongo';

import { KeyResourceSchema } from '../schemas';
import { CollectionNames } from '../constants';

const KeyResources = new Mongo.Collection(CollectionNames.KEY_RESOURCES);

KeyResources.attachSchema(KeyResourceSchema);

export { KeyResources };
