import { Mongo } from 'meteor/mongo';

import { WorkItemsSchema } from './work-item-schema.js';

const WorkItems = new Mongo.Collection('WorkItems');
WorkItems.attachSchema(WorkItemsSchema);

export { WorkItems };
