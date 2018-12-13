import { _ } from 'meteor/underscore';
import { CollectionNames, ProblemsStatuses, ProblemIndexes } from '/imports/share/constants';
import { Risks } from '/imports/share/collections/risks';
import { formatUser, formatLessonsLearned, formatMap } from '../formatters';

export const mapping = {
  collection: Risks,
  filterField: 'status',
  defaultFilterIndexes: _.chain(ProblemIndexes)
    .values()
    .difference([ProblemIndexes.DELETED])
    .value(),
  fields: {
    _id: {
      label: 'Risk ID',
      isDefault: true,
      reference: 'sequentialId',
    },
    title: {
      label: 'Risk name',
      isDefault: true,
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
      label: 'Departments/teams',
      isDefault: true,
      reference: {
        from: CollectionNames.DEPARTMENTS,
        internalField: 'departmentsIds',
        externalField: '_id',
        target: 'name',
        many: true,
      },
    },
    originatorId: {
      label: 'Originator',
      isDefault: true,
      format: formatUser,
      reference: {
        from: CollectionNames.USERS,
        internalField: 'originatorId',
        externalField: '_id',
      },
    },
    owner: {
      label: 'Owner',
      isDefault: true,
      format: formatUser,
      reference: {
        from: CollectionNames.USERS,
        internalField: 'ownerId',
        externalField: '_id',
      },
    },
    initialCategorization: {
      label: 'Initial categorization',
      reference: 'magnitude',
    },
    riskType: {
      label: 'Risk type',
      isDefault: true,
      reference: {
        from: CollectionNames.RISK_TYPES,
        internalField: 'typeId',
        externalField: '_id',
        target: 'title',
      },
    },
    score: {
      label: 'Score',
      isDefault: true,
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
      format: formatLessonsLearned,
      reference: {
        from: CollectionNames.LESSONS,
        internalField: '_id',
        externalField: 'documentId',
        target: 'serialNumber',
        many: true,
      },
    },
  },
};
