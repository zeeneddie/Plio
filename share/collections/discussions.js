import { Mongo } from 'meteor/mongo';

import { CollectionNames } from '../constants.js';
import { DiscussionsSchema } from '../schemas/discussions-schema.js';


const Discussions = new Mongo.Collection(CollectionNames.DISCUSSIONS);
Discussions.attachSchema(DiscussionsSchema);

export { Discussions };
