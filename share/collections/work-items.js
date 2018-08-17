import { Mongo } from 'meteor/mongo';

import { WorkItemsSchema } from '../schemas/work-item-schema';
import { CollectionNames } from '../constants';


const WorkItems = new Mongo.Collection(CollectionNames.WORK_ITEMS);
WorkItems.attachSchema(WorkItemsSchema);

WorkItems.publicFields = {
  organizationId: 1,
  targetDate: 1,
  type: 1,
  status: 1,
  linkedDoc: 1,
  assigneeId: 1,
  viewedBy: 1,
  createdAt: 1,
  isCompleted: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1,
};

export { WorkItems };
