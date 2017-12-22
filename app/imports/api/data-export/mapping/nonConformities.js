import { _ } from 'meteor/underscore';
import { CollectionNames, ProblemsStatuses, ProblemIndexes } from '/imports/share/constants';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { formatUser, formatLessonsLearned, formatMap, formatDate } from '../formatters';

export const mapping = {
  collection: NonConformities,
  filterField: 'status',
  defaultFilterIndexes: _.difference(
    _.values(ProblemIndexes),
    [
      ProblemIndexes.DELETED,
      ProblemIndexes.ACTIONS_VERIFIED_STANDARDS_REVIEWED,
      ProblemIndexes.CLOSED_ACTIONS_COMPLETED,
    ],
  ),
  fields: {
    _id: {
      label: 'Non-conformity ID',
      isDefault: true,
      reference: 'sequentialId',
    },
    name: {
      label: 'Non-conformity name',
      isDefault: true,
      reference: 'title',
    },
    description: {
      label: 'Description',
    },
    status: {
      label: 'Status',
      isDefault: true,
      format: formatMap(ProblemsStatuses),
    },
    statusComment: {
      label: 'Status comment',
      isDefault: true,
    },
    standards: {
      label: 'Standard(s)',
      isDefault: true,
      reference: {
        from: CollectionNames.STANDARDS,
        internalField: 'standardsIds',
        externalField: '_id',
        target: 'title',
        many: true,
      },
    },
    departments: {
      label: 'Department/sector(s)',
      isDefault: true,
      reference: {
        from: CollectionNames.DEPARTMENTS,
        internalField: 'departmentsIds',
        externalField: '_id',
        target: 'name',
        many: true,
      },
    },
    identifiedBy: {
      label: 'Identified by',
      isDefault: true,
      format: formatUser,
      reference: {
        from: CollectionNames.USERS,
        internalField: 'identifiedBy',
        externalField: '_id',
      },
    },
    identifiedDate: {
      label: 'Identified date',
      isDefault: true,
      reference: 'identifiedAt',
      format: formatDate,
    },
    magnitude: {
      label: 'Magnitude',
      isDefault: true,
    },
    approxCost: {
      label: 'Financial impact',
      reference: 'cost',
    },
    occurrences: {
      label: 'Occurrence',
      reference: {
        from: CollectionNames.OCCURRENCES,
        internalField: '_id',
        externalField: 'nonConformityId',
        target: 'sequentialId',
        many: true,
      },
    },
    actions: {
      label: 'Actions',
      isDefault: true,
      reference: {
        from: CollectionNames.ACTIONS,
        internalField: '_id',
        externalField: 'linkedTo.documentId',
        target: 'sequentialId',
        many: true,
      },
    },
    lessonsLearned: {
      label: 'Lessons learned',
      reference: {
        from: CollectionNames.LESSONS,
        internalField: '_id',
        externalField: 'documentId',
        target: 'serialNumber',
        many: true,
      },
      format: formatLessonsLearned,
    },
  },
};
