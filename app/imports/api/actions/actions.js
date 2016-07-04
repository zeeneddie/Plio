import { Mongo } from 'meteor/mongo';

import { ActionSchema } from './action-schema.js';
import { NonConformities } from '../non-conformities/non-conformities.js';
import { Risks } from '../risks/risks.js';
import { ActionUndoTimeInHours } from '../constants.js';
import { compareDates } from '../helpers.js';


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
  },
  canBeCompleted() {
    return _.every([
      this.isCompleted === false,
      this.isVerified === false
    ]);
  },
  canCompletionBeUndone() {
    const completedAt = this.completedAt;

    if (!_.every([
          this.isCompleted === true,
          this.isVerified === false,
          _.isDate(completedAt)
        ])) {
      return false;
    }

    const undoDeadline = new Date(completedAt.getTime());
    undoDeadline.setHours(undoDeadline.getHours() + ActionUndoTimeInHours);

    return compareDates(undoDeadline, new Date()) === 1;
  },
  canBeVerified() {
    return _.every([
      this.isCompleted === true,
      this.isVerified === false
    ]);
  },
  canVerificationBeUndone() {
    const verifiedAt = this.verifiedAt;

    if (!(this.isVerified === true && _.isDate(verifiedAt))) {
      return false;
    }

    const undoDeadline = new Date(verifiedAt.getTime());
    undoDeadline.setHours(undoDeadline.getHours() + ActionUndoTimeInHours);

    return compareDates(undoDeadline, new Date()) === 1;
  },
  isLinkedTo(docId, docType) {
    return _.filter(this.linkedTo, ({ documentId, documentType }) => {
      return (documentId === docId) && (documentType === docType);
    }).length > 0;
  }
});

export { Actions };
