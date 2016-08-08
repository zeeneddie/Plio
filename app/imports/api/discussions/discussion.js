import { Mongo } from 'meteor/mongo';

import { DiscussionSchema } from './discussion-schema.js';


const Discussions = new Mongo.Collection('Discussions');
Discussions.attachSchema(DiscussionSchema);

export { Discussions };
