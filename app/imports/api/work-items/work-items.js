import { Mongo } from 'meteor/mongo';

import { WorkItemSchema } from './work-item-schema.js';

const WorkItems = new Mongo.Collection('WorkItems');
WorkItems.attachSchema(WorkItemSchema);

export { WorkItems };
