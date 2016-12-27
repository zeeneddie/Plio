import { _ } from 'meteor/underscore';
import { CollectionNames, ProblemsStatuses } from '/imports/share/constants';
import { Risks } from '/imports/share/collections/risks';

export const mapping = {
  collection: Risks,
  filter: { status: { $lt: 18 }, isDeleted: { $ne: true } }, // open only
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
    statusComment: {
      label: 'Status comment',
      isDefault: true,
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
    score: {
      label: 'Score',
      reference: 'scores',
      format(fieldValue) {
        const scores = fieldValue.sort((a, b) => b.scoredAt.getTime() - a.scoredAt.getTime());
        const score = scores.find(scoreItem => scoreItem.scoreTypeId === 'residual') ||
          _.first(scores);

        return score ? `${score.value} - ${score.scoreTypeId}` : '';
      },
    },
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
