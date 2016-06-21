import { Mongo } from 'meteor/mongo';

import { ImprovementPlansSchema } from './improvement-plans-schema.js';
import { Standards } from '../standards/standards.js';
import { NonConformities } from '../non-conformities/non-conformities.js';
import { Risks } from '../risks/risks.js';


const ImprovementPlans = new Mongo.Collection('ImprovementPlans');
ImprovementPlans.attachSchema(ImprovementPlansSchema);

ImprovementPlans.helpers({
  relatedDocument() {
    const docType = this.documentType;
    let docCollection;

    if (docType === 'standard') {
      docCollection = Standards;
    } else if (docType === 'non-conformity') {
      docCollection = NonConformities;
    } else if (docType === 'risk') {
      docCollection = Risks;
    }

    return docCollection && docCollection.findOne({ _id: this.documentId });
  }
});

export { ImprovementPlans };
