import { CollectionNames, ProblemsStatuses } from '/imports/share/constants';
import { Risks } from '/imports/share/collections/risks';

export const mapping = {
  collection: Risks,
  fields: {
    _id: {
      label: 'Risk ID',
      required: true,
      reference: '_id',
    },
    title: {
      label: 'Risk name',
      required: true,
    },
    description: {
      label: 'Description',
    },
    status: {
      label: 'Status',
      mapper: ProblemsStatuses,
    },
    workflowType: {
      label: 'Workflow Type',
    },
    standards: {
      label: 'Standard(s)',
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
      reference: {
        from: CollectionNames.USERS,
        internalField: 'identifiedBy',
        externalField: '_id',
        target: 'emails.0.address',
      },
    },
    identifiedDate: {
      label: 'Identified date',
      reference: 'identifiedAt',
    },
    initialCategorization: {
      label: 'Initial categorization',
      reference: 'magnitude',
    },
    riskType: {
      label: 'Risk type',
      reference: {
        from: CollectionNames.RISK_TYPES,
        internalField: 'typeId',
        externalField: '_id',
        target: 'title',
      },
    },
    notifyChanges: {
      label: 'Notify changes',
      reference: {
        from: CollectionNames.USERS,
        internalField: 'notify',
        externalField: '_id',
        target: 'emails.0.address',
        many: true,
      },
    },
    // score: {
    //   label: 'Score(s)',
    //   reference: {
    //     from: CollectionNames.S,
    //     internalField: 'notify',
    //     externalField: '_id',
    //     target: 'emails.0.address',
    //     many: true,
    //   },
    // },
    // scoreType: {
    //   label: 'Score type',
    // },
    actions: {
      label: 'Actions',
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
        target: 'title',
        many: true,
      },
    },
  },
};
