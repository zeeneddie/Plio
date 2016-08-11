import { Mongo } from 'meteor/mongo';

import { DiscussionsSchema } from './discussions-schema.js';


const Discussions = new Mongo.Collection('Discussions');
Discussions.attachSchema(DiscussionsSchema);

export { Discussions };
