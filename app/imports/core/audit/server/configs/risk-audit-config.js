import { Risks } from '/imports/api/risks/risks.js';
import {
  CollectionNames,
  RiskEvaluationPriorities,
  RiskEvaluationDecisions
} from '/imports/api/constants.js';
import { getUserFullNameOrEmail, getPrettyOrgDate } from '../utils/helpers.js';
import { ChangesKinds } from '../utils/changes-kinds.js';
import ProblemAuditConfig from './problem-audit-config.js';


const {
  FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED,
  ITEM_ADDED, ITEM_REMOVED
} = ChangesKinds;

export default RiskAuditConfig = _.extend({}, ProblemAuditConfig, {

  collection: Risks,

  collectionName: CollectionNames.RISKS,

  updateHandlers: [
    ...ProblemAuditConfig.updateHandlers,

    {
      field: 'review.comments',
      logs: [
        {
          message: {
            [FIELD_ADDED]: 'Review comments set',
            [FIELD_CHANGED]: 'Review comments changed',
            [FIELD_REMOVED]: 'Review comments removed'
          }
        }
      ],
      notifications: []
    },

    {
      field: 'review.reviewedAt',
      logs: [
        {
          message: {
            [FIELD_ADDED]: 'Review date set to "{{newValue}}"',
            [FIELD_CHANGED]: 'Review date changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]: 'Review date removed'
          }
        }
      ],
      notifications: [],
      data({ diffs, newDoc }) {
        const { newValue, oldValue } = diffs['review.reviewedAt'];
        const auditConfig = this;
        const orgId = () => auditConfig.docOrgId(newDoc);

        return {
          newValue: getPrettyOrgDate(newValue, orgId()),
          oldValue: getPrettyOrgDate(oldValue, orgId())
        };
      }
    },

    {
      field: 'review.reviewedBy',
      logs: [
        {
          message: {
            [FIELD_ADDED]: 'Review executor set to {{newValue}}',
            [FIELD_CHANGED]: 'Review executor changed from {{oldValue}} to {{newValue}}',
            [FIELD_REMOVED]: 'Review executor removed'
          }
        }
      ],
      notifications: [],
      data({ diffs, newDoc }) {
        const { newValue, oldValue } = diffs['review.reviewedBy'];

        return {
          newValue: () => getUserFullNameOrEmail(newValue),
          oldValue: () => getUserFullNameOrEmail(oldValue)
        };
      }
    },

    {
      field: 'riskEvaluation.comments',
      logs: [
        {
          message: {
            [FIELD_ADDED]: 'Risk evaluation comments set',
            [FIELD_CHANGED]: 'Risk evaluation comments changed',
            [FIELD_REMOVED]: 'Risk evaluation comments removed'
          }
        }
      ],
      notifications: []
    },

    {
      field: 'riskEvaluation.decision',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Risk evaluation treatment decision set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Risk evaluation treatment decision changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Risk evaluation treatment decision removed'
          }
        }
      ],
      notifications: [],
      data({ diffs }) {
        const { newValue, oldValue } = diffs['riskEvaluation.decision'];

        return {
          newValue: () => RiskEvaluationDecisions[newValue],
          oldValue: () => RiskEvaluationDecisions[oldValue]
        };
      }
    },

    {
      field: 'riskEvaluation.prevLossExp',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Risk evaluation previous loss experience set',
            [FIELD_CHANGED]:
              'Risk evaluation previous loss experience changed',
            [FIELD_REMOVED]:
              'Risk evaluation previous loss experience removed'
          }
        }
      ],
      notifications: []
    },

    {
      field: 'riskEvaluation.priority',
      logs: [
        {
          message: {
            [FIELD_ADDED]:
              'Risk evaluation treatment priority set to "{{newValue}}"',
            [FIELD_CHANGED]:
              'Risk evaluation treatment priority changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]:
              'Risk evaluation treatment priority removed'
          }
        }
      ],
      notifications: [],
      data({ diffs }) {
        const { newValue, oldValue } = diffs['riskEvaluation.priority'];

        return {
          newValue: () => RiskEvaluationPriorities[newValue],
          oldValue: () => RiskEvaluationPriorities[oldValue]
        };
      }
    },

    {
      field: 'scores',
      logs: [
        {
          message: {
            [ITEM_ADDED]:
              'Risk score added: value - {{value}}, scored by {{userName}} on {{date}}',
            [ITEM_REMOVED]:
              'Risk score removed: value - {{value}}, scored by {{userName}} on {{date}}'
          }
        }
      ],
      notifications: [],
      data({ diffs: { scores }, newDoc }) {
        const { item: { value, scoredAt, scoredBy } } = scores;
        const auditConfig = this;
        const orgId = () => auditConfig.docOrgId(newDoc);

        return {
          value: () => value,
          date: () => getPrettyOrgDate(scoredAt, orgId()),
          userName: () => getUserFullNameOrEmail(scoredBy)
        };
      }
    },

    {
      field: 'typeId',
      logs: [
        {
          message: {
            [FIELD_ADDED]: 'Risk type set to "{{newValue}}"',
            [FIELD_CHANGED]: 'Risk type changed from "{{oldValue}}" to "{{newValue}}"',
            [FIELD_REMOVED]: 'Risk type removed'
          }
        }
      ],
      notifications: [],
      data({ diffs: { typeId } }) {
        const { newValue, oldValue } = typeId;

        const getRiskTypeTitle = (_id) => {
          const { title } = RiskTypes.findOne({ _id }) || {};
          return title;
        };

        return {
          newValue: () => getRiskTypeTitle(newValue),
          oldValue: () => getRiskTypeTitle(oldValue)
        };
      }
    }
  ],

  docUrl({ _id, organizationId }) {
    const { serialNumber } = Organizations.findOne({ _id: organizationId });

    return Meteor.absoluteUrl(`${serialNumber}/risks/${_id}`);
  }

});
