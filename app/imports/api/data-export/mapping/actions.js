import { ActionStatuses } from '/imports/share/constants';
import { Actions } from '/imports/share/collections/actions';

export const mapping = {
  collection: Actions,
  filter: { status: { $lt: 6 }, isDeleted: { $ne: true } }, // only in progress actions
  fields: {
    _id: {
      label: 'Action ID',
      required: true,
      reference: '_id',
    },
    title: {
      label: 'Title',
      required: true,
    },
    description: {
      label: 'Description',
    },
    linkedTo: {
      label: 'Linked to',
      reference: 'linkedTo.documentId',
    },
    status: {
      label: 'Status',
      mapper: ActionStatuses,
    },
    owner: {
      label: 'Owner',
      reference: 'ownerId',
    },
    planInPlace: {
      label: 'Plan in place?',
    },
    completionTargetDate: {
      label: 'Completion - target date',
    },
    completedOn: {
      label: 'Completed on',
      reference: 'completedAt',
    },
    completedBy: {
      label: 'Completed by',
    },
    completionComments: {
      label: 'Completion comments',
    },
    verificationTargetDate: {
      label: 'Verification - target date',
    },
    verifiedBy: {
      label: 'Verified by',
    },
    verificationComments: {
      label: 'Verification comments',
    },
    notes: {
      label: 'Notes',
    },
  },
};
