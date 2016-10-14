import { Mongo } from 'meteor/mongo';

import { WorkItemsSchema } from './work-item-schema.js';
import { Actions } from '../actions/actions.js';
import { NonConformities } from '../non-conformities/non-conformities.js';
import { Risks } from '../risks/risks.js';
import { WorkItemsStore } from '../constants.js';


const WorkItems = new Mongo.Collection('WorkItems');
WorkItems.attachSchema(WorkItemsSchema);

WorkItems.helpers({
  getLinkedDoc() {
    const { _id, type } = this.linkedDoc;

    const { LINKED_TYPES } = WorkItemsStore;

    const collections = {
      [LINKED_TYPES.NON_CONFORMITY]: NonConformities,
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
