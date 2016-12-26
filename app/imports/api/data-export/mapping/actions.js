import { CollectionNames } from '/imports/share/constants';
import { Risks } from '/imports/share/collections/risks';

export const mapping = {
  collection: Risks,
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
      reference: {
        from: CollectionNames.ACTIONS,
        internalField: '_id',
        externalField: 'linkedTo.documentId',
        target: 'sequentialId',
        many: true,
      },
    },
    status: {
      label: 'Status',
    },
    owner: {
      label: 'Owner',
    },
    planInPlace: {
      label: 'Plan in place?',
    },
    completionTargetDate: {
      label: 'Completion - target date',
    },
    completedOn: {
      label: 'Completed on',
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
