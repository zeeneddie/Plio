import { Mongo } from 'meteor/mongo';
import moment from 'moment-timezone';
import { _ } from 'meteor/underscore';

import { ActionSchema } from '../schemas/action-schema';
import { NonConformities } from './non-conformities';
import { Risks } from './risks';
import { WorkItems } from './work-items';
import {
  ActionUndoTimeInHours,
  ProblemTypes,
  CollectionNames,
} from '../constants';
import { getActionWorkflowType } from '../helpers';

const Actions = new Mongo.Collection(CollectionNames.ACTIONS);
Actions.attachSchema(ActionSchema);

const getLinkedDocsIds = (linkedDocs = [], docType) => _.pluck(
  _.filter(
    linkedDocs,
    ({ documentType }) => documentType === docType,
  ),
  'documentId',
);

Actions.helpers({
  getLinkedNCsIds() {
    const NCIds = getLinkedDocsIds(this.linkedTo, ProblemTypes.NON_CONFORMITY);
    const PGIds = getLinkedDocsIds(this.linkedTo, ProblemTypes.POTENTIAL_GAIN);
    return NCIds.concat(PGIds);
  },
  getLinkedNCs() {
    return NonConformities.find({
      _id: {
        $in: this.getLinkedNCsIds(),
      },
    }).fetch();
  },
  getLinkedRisksIds() {
    return getLinkedDocsIds(this.linkedTo, ProblemTypes.RISK);
  },
  getLinkedRisks() {
    return Risks.find({
      _id: {
        $in: this.getLinkedRisksIds(),
      },
    }).fetch();
  },
  getLinkedDocuments() {
    return this.getLinkedNCs().concat(this.getLinkedRisks());
  },
  canBeCompleted() {
    const { isCompleted, isVerified } = this;
    return (isCompleted === false) && (isVerified === false);
  },
  canCompletionBeUndone() {
    const { isCompleted, isVerified, completedAt } = this;

    if (!_.every([
      isCompleted === true,
      isVerified === false,
      _.isDate(completedAt),
    ])) {
      return false;
    }

    const undoDeadline = moment(completedAt).add(ActionUndoTimeInHours, 'hours');

    return undoDeadline.isAfter(new Date());
  },
  canBeVerified() {
    const { isCompleted, isVerified } = this;
    return (isCompleted === true) && (isVerified === false);
  },
  canVerificationBeUndone() {
    const { isVerified, verifiedAt } = this;

    if (!(isVerified === true && _.isDate(verifiedAt))) {
      return false;
    }

    const undoDeadline = moment(verifiedAt).add(ActionUndoTimeInHours, 'hours');

    return undoDeadline.isAfter(new Date());
  },
  isLinkedToDocument(docId, docType) {
    return !!_.find(this.linkedTo, ({ documentId, documentType }) =>
      (documentId === docId) && (documentType === docType));
  },
  completed() {
    const { isCompleted, completedAt, completedBy } = this;
    return (isCompleted === true) && completedAt && completedBy;
  },
  verified() {
    const { isVerified, verifiedAt, verifiedBy } = this;
    return (isVerified === true) && verifiedAt && verifiedBy;
  },
  verifiedAsEffective() {
    return this.verified() && (this.isVerifiedAsEffective === true);
  },
  failedVerification() {
    return this.verified() && (this.isVerifiedAsEffective === false);
  },
  deleted() {
    const { isDeleted, deletedAt, deletedBy } = this;
    return (isDeleted === true) && deletedAt && deletedBy;
  },
  getWorkflowType() {
    return getActionWorkflowType(this);
  },
  getWorkItems() {
    return WorkItems.find({ 'linkedDoc._id': this._id }).fetch();
  },
  getWorkItemsIds() {
    return WorkItems.find({ 'linkedDoc._id': this._id }).map(doc => doc._id);
  },
});

Actions.publicFields = {
  organizationId: 1,
  serialNumber: 1,
  sequentialId: 1,
  title: 1,
  linkedTo: 1,
  type: 1,
  status: 1,
  ownerId: 1,
  isCompleted: 1,
  isVerified: 1,
  isVerifiedAsEffective: 1,
  toBeVerifiedBy: 1,
  verificationTargetDate: 1,
  verifiedBy: 1,
  verifiedAt: 1,
  completionTargetDate: 1,
  toBeCompletedBy: 1,
  viewedBy: 1,
  createdAt: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1,
};

export { Actions };
