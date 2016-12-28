import { _ } from 'meteor/underscore';
import { ActionStatuses, CollectionNames } from '/imports/share/constants';
import { Actions } from '/imports/share/collections/actions';
import { formatUserEmail, stripHtml } from '../formatters';


export const mapping = {
  collection: Actions,
  filter: { status: { $lt: 6 }, isDeleted: { $ne: true } }, // only in progress actions
  fields: {
    _id: {
      label: 'Action ID',
      isDefault: true,
      reference: 'sequentialId',
    },
    title: {
      label: 'Title',
      isDefault: true,
    },
    description: {
      label: 'Description',
    },
    status: {
      label: 'Status',
      mapper: ActionStatuses,
    },
    owner: {
      label: 'Owner',
      format: formatUserEmail,
      reference: {
        from: CollectionNames.USERS,
        internalField: 'ownerId',
        externalField: '_id',
        target: 'emails',
      },
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
      format: formatUserEmail,
      reference: {
        from: CollectionNames.USERS,
        internalField: 'completedBy',
        externalField: '_id',
        target: 'emails',
      },
    },
    completionComments: {
      label: 'Completion comments',
    },
    verificationTargetDate: {
      label: 'Verification - target date',
    },
    verifiedBy: {
      label: 'Verified by',
      format: formatUserEmail,
      reference: {
        from: CollectionNames.USERS,
        internalField: 'verifiedBy',
        externalField: '_id',
        target: 'emails',
      },
    },
    verificationComments: {
      label: 'Verification comments',
    },
    notes: {
      label: 'Notes',
      format: stripHtml,
    },
  },
};
