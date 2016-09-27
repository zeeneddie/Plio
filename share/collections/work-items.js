import { Mongo } from 'meteor/mongo';

import { WorkItemsSchema } from '../schemas/work-item-schema.js';
import { Actions } from './actions.js';
import { NonConformities } from './non-conformities.js';
import { Risks } from './risks.js';
import { CollectionNames, WorkItemsStore } from '../constants.js';


const WorkItems = new Mongo.Collection(CollectionNames.WORK_ITEMS);
WorkItems.attachSchema(WorkItemsSchema);

WorkItems.helpers({
  getLinkedDoc() {
    const { _id, type } = this.linkedDoc;

    const { LINKED_TYPES } = WorkItemsStore;

    const collections = {
      [LINKED_TYPES.NC]: NonConformities,
      [LINKED_TYPES.RISK]: Risks,
      [LINKED_TYPES.CORRECTIVE_ACTION]: Actions,
      [LINKED_TYPES.PREVENTATIVE_ACTION]: Actions,
      [LINKED_TYPES.RISK_CONTROL]: Actions
    };

    const docCollection = collections[type];

    return docCollection && docCollection.findOne({ _id });
  }
});

export { WorkItems };
