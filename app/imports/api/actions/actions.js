import { Mongo } from 'meteor/mongo';

import { ActionSchema } from './action-schema.js';
import { NonConformities } from '../non-conformities/non-conformities.js';
import { Risks } from '../risks/risks.js';
import { ActionUndoTimeInHours, ProblemTypes } from '../constants.js';
import { compareDates } from '../helpers.js';


const Actions = new Mongo.Collection('Actions');
Actions.attachSchema(ActionSchema);

const getLinkedDocsIds = (linkedDocs, docType) => {
  return _.pluck(
    _.filter(
      linkedDocs,
      ({ documentType }) => documentType === docType
    ),
    'documentId'
  );
};

Actions.helpers({
  getLinkedNCsIds() {
    return getLinkedDocsIds(this.linkedTo, ProblemTypes.NC);
  },
  getLinkedNCs() {
    return NonConformities.find({
      _id: {
        $in: this.getLinkedNCsIds()
      }
    }).fetch();
  },
  getLinkedRisksIds() {
    return getProbemDocsIds(this.linkedTo, ProblemTypes.RISK);
  },
  getLinkedRisks() {
    return Risks.find({
      _id: {
        $in: this.getLinkedRisksIds()
      }
    }).fetch();
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
  isLinkedToDocument(docId, docType) {
    return !!_.find(this.linkedTo, ({ documentId, documentType }) => {
      return (documentId === docId) && (documentType === docType);
    });
  }
});

export { Actions };
