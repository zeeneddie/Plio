import { _ } from 'meteor/underscore';
import { ActionStatuses, ActionIndexes, CollectionNames } from '/imports/share/constants';
import { Actions } from '/imports/share/collections/actions';
import { formatUser, stripHtml, formatDate, formatMap } from '../formatters';

export const mapping = {
  collection: Actions,
  filterField: 'status',
  defaultFilterIndexes: _.difference(
    _.values(ActionIndexes),
    [
      ActionIndexes.DELETED,
      ActionIndexes.COMPLETED,
      ActionIndexes.COMPLETED_EFFECTIVE,
      ActionIndexes.COMPLETED_FAILED,
    ],
  ),
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
      format: formatMap(ActionStatuses),
    },
    owner: {
      label: 'Owner',
      format: formatUser,
      reference: {
        from: CollectionNames.USERS,
        internalField: 'ownerId',
        externalField: '_id',
      },
    },
    planInPlace: {
      label: 'Plan in place?',
    },
    completionTargetDate: {
      label: 'Completion - target date',
      format: formatDate,
    },
    completedOn: {
      label: 'Completed on',
      reference: 'completedAt',
      format: formatDate,
    },
    completedBy: {
      label: 'Completed by',
      format: formatUser,
      reference: {
        from: CollectionNames.USERS,
        internalField: 'completedBy',
        externalField: '_id',
      },
    },
    completionComments: {
      label: 'Completion comments',
    },
    verificationTargetDate: {
      label: 'Verification - target date',
      format: formatDate,
    },
    verifiedBy: {
      label: 'Verified by',
      format: formatUser,
      reference: {
        from: CollectionNames.USERS,
        internalField: 'verifiedBy',
        externalField: '_id',
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
