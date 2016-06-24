import { Mongo } from 'meteor/mongo';

import { ActionSchema } from './action-schema.js';
import { NonConformities } from '../non-conformities/non-conformities.js';
import { Risks } from '../risks/risks.js';


const Actions = new Mongo.Collection('Actions');
Actions.attachSchema(ActionSchema);

Actions.helpers({
  linkedDocuments() {
    const NCsIds = [];
    const RisksIds = [];

    _.each(this.linkedTo, (doc) => {
      const docType = doc.documentType;
      if (docType === 'non-conformity') {
        NCsIds.push(doc.documentId);
      } else if (docType === 'risk') {
        RisksIds.push(doc.documentId);
      }
    });

    const NCs = NonConformities.find({ _id: { $in: NCsIds } }).fetch();
    const risks = Risks.find({ _id: { $in: RisksIds } }).fetch();

    return NCs.concat(risks);
  }
});

export { Actions };
