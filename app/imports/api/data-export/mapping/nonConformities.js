import { CollectionNames, ProblemsStatuses } from '/imports/share/constants';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { formatUserEmail, formatLessonsLearned } from '../formatters';

export const mapping = {
  collection: NonConformities,
  filter: { status: { $lt: 18 }, isDeleted: { $ne: true } }, // open only
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
      mapper: ProblemsStatuses,
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
      format: formatUserEmail,
      reference: {
        from: CollectionNames.USERS,
        internalField: 'identifiedBy',
        externalField: '_id',
        target: 'emails',
      },
    },
    identifiedDate: {
      label: 'Identified date',
      isDefault: true,
      reference: 'identifiedAt',
    },
    magnitude: {
      label: 'Magnitude',
      isDefault: true,
    },
    approxCost: {
      label: 'Approx cost per occurrence?',
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
