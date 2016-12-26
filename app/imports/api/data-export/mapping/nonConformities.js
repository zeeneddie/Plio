import { CollectionNames, ActionStatuses } from '/imports/share/constants';
import { NonConformities } from '/imports/share/collections/non-conformities';

export const mapping = {
  collection: NonConformities,
  fields: {
    _id: {
      label: 'Non-conformity ID',
      required: true,
    },
    name: {
      label: 'Non-conformity name',
      required: true,
      reference: 'title',
    },
    description: {
      label: 'Description',
    },
    status: {
      label: 'Status',
      mapper: ActionStatuses,
    },
    // statusComment: {
    //   label: 'Status comment',
    // },
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
    departmentSectors: {
      label: 'Department/sector(s)',
    },
    identifiedDate: {
      label: 'Identified date',
    },
    magnitude: {
      label: 'Magnitude',
    },
    approxCost: {
      label: 'Approx cost per occurrence?',
    },
    helpUrl: {
      label: 'Help desk ref URL',
    },
    notifyChanges: {
      label: 'Notify changes',
    },
    occurences: {
      label: 'Occurences',
    },
    actions: {
      label: 'Actions',
    },
    lessonsLearned: {
      label: 'Lessons learned',
    },
  },
};
