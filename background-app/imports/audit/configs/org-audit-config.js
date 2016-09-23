import { CollectionNames, OrgCurrencies, UserMembership } from '/imports/api/constants.js';
import { getUserFullNameOrEmail, getUserId } from '../utils/helpers.js';
import { ChangesKinds } from '../utils/changes-kinds.js';


const {
  FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED,
  ITEM_ADDED, ITEM_REMOVED
} = ChangesKinds;

const getReceivers = function({ newDoc: { users }, user }) {
  const executorId = getUserId(user);

  const orgOwners = _(users).filter((userData) => {
    const { userId, role, isRemoved } = userData;

    return _.every([
      executorId !== userId,
      role === UserMembership.ORG_OWNER,
      isRemoved === false
    ]);
  });

  return _(orgOwners).pluck('userId');
};

const getWorkflowDefaultsConfig = (field, label) => {
  return [
    {
      field: `workflowDefaults.${field}.workflowType`,
      logs: [],
      notifications: [
        {
          text: {
            [FIELD_CHANGED]:
              `{{userName}} changed workflow type for ${label} ` +
              `from "{{oldValue}}" to "{{newValue}}" in {{{docDesc}}}`
          }
        }
      ],
      data({ diffs, newDoc, user }) {
        const { newValue, oldValue } = diffs[
          `workflowDefaults.${field}.workflowType`
        ];
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => newValue,
          oldValue: () => oldValue
        };
      },
      receivers: getReceivers
    },

    {
      field: `workflowDefaults.${field}.stepTime.timeUnit`,
      logs: [],
      notifications: [
        {
          text: {
            [FIELD_CHANGED]:
              `{{userName}} changed default step time for ${label} ` +
              `from "{{oldValue}}" to "{{newValue}}" in {{{docDesc}}}`
          }
        }
      ],
      data({ diffs, newDoc, user }) {
        const auditConfig = this;
        const { newValue, oldValue } = diffs[
          `workflowDefaults.${field}.stepTime.timeUnit`
        ];
        const timeVal = newDoc.workflowDefaults[field].stepTime.timeValue;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => `${timeVal} ${newValue}`,
          oldValue: () => `${timeVal} ${oldValue}`
        };
      },
      receivers: getReceivers
    },

    {
      field: `workflowDefaults.${field}.stepTime.timeValue`,
      logs: [],
      notifications: [
        {
          text: {
            [FIELD_CHANGED]:
              `{{userName}} changed default step time for ${label} ` +
              `from "{{oldValue}}" to "{{newValue}}" in {{{docDesc}}}`
          }
        }
      ],
      data({ diffs, newDoc, user }) {
        const auditConfig = this;
        const { newValue, oldValue } = diffs[
          `workflowDefaults.${field}.stepTime.timeValue`
        ];
        const timeUnit = newDoc.workflowDefaults[field].stepTime.timeUnit;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => `${newValue} ${timeUnit}`,
          oldValue: () => `${oldValue} ${timeUnit}`
        };
      },
      receivers: getReceivers
    },
  ];
};

const getRemindersConfig = (field, label) => {
  const getReminderConfig = (reminderType, reminderLabel) => {
    return [
      {
        field: `reminders.${field}.${reminderType}.timeValue`,
        logs: [],
        notifications: [
          {
            text: {
              [FIELD_CHANGED]:
                `{{userName}} changed ${reminderLabel} for ${label} ` +
                `from "{{oldValue}}" to "{{newValue}}" in {{{docDesc}}}`
            }
          }
        ],
        data({ diffs, newDoc, user }) {
          const auditConfig = this;
          const { newValue, oldValue } = diffs[
            `reminders.${field}.${reminderType}.timeValue`
          ];
          const timeUnit = newDoc.reminders[field][reminderType].timeUnit;

          return {
            docDesc: () => auditConfig.docDescription(newDoc),
            userName: () => getUserFullNameOrEmail(user),
            newValue: () => `${newValue} ${timeUnit}`,
            oldValue: () => `${oldValue} ${timeUnit}`
          };
        },
        receivers: getReceivers
      },

      {
        field: `reminders.${field}.${reminderType}.timeUnit`,
        logs: [],
        notifications: [
          {
            text: {
              [FIELD_CHANGED]:
                `{{userName}} changed ${reminderLabel} for ${label} ` +
                `from "{{oldValue}}" to "{{newValue}}" in {{{docDesc}}}`
            }
          }
        ],
        data({ diffs, newDoc, user }) {
          const auditConfig = this;
          const { newValue, oldValue } = diffs[
            `reminders.${field}.${reminderType}.timeUnit`
          ];
          const timeValue = newDoc.reminders[field][reminderType].timeValue;

          return {
            docDesc: () => auditConfig.docDescription(newDoc),
            userName: () => getUserFullNameOrEmail(user),
            newValue: () => `${timeValue} ${newValue}`,
            oldValue: () => `${timeValue} ${oldValue}`
          };
        },
        receivers: getReceivers
      }
    ];
  };

  return [
    ...getReminderConfig('start', 'reminder start time'),
    ...getReminderConfig('interval', 'reminder interval'),
    ...getReminderConfig('until', 'reminder end time')
  ];
};

const getGuidelinesConfig = (field, guidelineType, label) => {
  return {
    field: `${field}.${guidelineType}`,
    logs: [],
    notifications: [
      {
        text: {
          [FIELD_CHANGED]: `{{userName}} changed guidelines for ${label} in {{{docDesc}}}`
        }
      }
    ],
    data({ newDoc, user }) {
      const auditConfig = this;

      return {
        docDesc: () => auditConfig.docDescription(newDoc),
        userName: () => getUserFullNameOrEmail(user)
      };
    },
    receivers: getReceivers
  };
};

export default OrgAuditConfig = {

  collection: Organizations,

  collectionName: CollectionNames.ORGANIZATIONS,

  onCreated: { },

  updateHandlers: [
    {
      field: 'name',
      logs: [],
      notifications: [
        {
          text: {
            [FIELD_CHANGED]:
              '{{userName}} changed name of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"'
          }
        }
      ],
      data({ diffs: { name }, oldDoc, user }) {
        const { newValue, oldValue } = name;
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(oldDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => newValue,
          oldValue: () => oldValue
        };
      },
      receivers: getReceivers
    },

    {
      field: 'timezone',
      logs: [],
      notifications: [
        {
          text: {
            [FIELD_CHANGED]:
              '{{userName}} changed timezone of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"'
          }
        }
      ],
      data({ diffs: { timezone }, newDoc, user }) {
        const { newValue, oldValue } = timezone;
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => newValue,
          oldValue: () => oldValue
        };
      },
      receivers: getReceivers
    },

    {
      field: 'currency',
      logs: [],
      notifications: [
        {
          text: {
            [FIELD_CHANGED]:
              '{{userName}} changed currency of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"'
          }
        }
      ],
      data({ diffs: { currency }, newDoc, user }) {
        const { newValue, oldValue } = currency;
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user),
          newValue: () => OrgCurrencies[newValue],
          oldValue: () => OrgCurrencies[oldValue]
        };
      },
      receivers: getReceivers
    },

    ...getWorkflowDefaultsConfig(
      'minorProblem', 'minor non-conformities/risks'
    ),

    ...getWorkflowDefaultsConfig(
      'majorProblem', 'major non-conformities/risks'
    ),

    ...getWorkflowDefaultsConfig(
      'criticalProblem', 'critical non-conformities/risks'
    ),

    ...getRemindersConfig('minorNc', 'minor non-conformities'),

    ...getRemindersConfig('majorNc', 'major non-conformities'),

    ...getRemindersConfig('criticalNc', 'critical non-conformities'),

    ...getRemindersConfig('improvementPlan', 'improvement plans'),

    getGuidelinesConfig('ncGuidelines', 'minor', 'minor non-conformities'),

    getGuidelinesConfig('ncGuidelines', 'major', 'major non-conformities'),

    getGuidelinesConfig('ncGuidelines', 'critical', 'critical non-conformities'),

    getGuidelinesConfig('rkGuidelines', 'minor', 'minor risks'),

    getGuidelinesConfig('rkGuidelines', 'major', 'major risks'),

    getGuidelinesConfig('rkGuidelines', 'critical', 'critical risks'),

    {
      field: 'rkScoringGuidelines',
      logs: [],
      notifications: [
        {
          text: {
            [FIELD_CHANGED]: '{{userName}} changed risk scoring guidelines in {{{docDesc}}}'
          }
        }
      ],
      data({ newDoc, user }) {
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
          userName: () => getUserFullNameOrEmail(user)
        };
      },
      receivers: getReceivers
    }
  ],

  onRemoved: { },

  docId({ _id }) {
    return _id;
  },

  docDescription({ name }) {
    return `"${name}" organization`;
  },

  docOrgId({ _id }) {
    return _id;
  },

  docUrl({ serialNumber }) {
    return Meteor.absoluteUrl(`${serialNumber}`);
  }

};
