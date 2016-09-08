import {
  CollectionNames,
  SystemName,
  OrgCurrencies,
  UserMembership
} from '/imports/api/constants.js';
import { getUserFullNameOrEmail } from '/imports/api/helpers.js';
import { ChangesKinds } from '../utils/changes-kinds.js';


const {
  FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED,
  ITEM_ADDED, ITEM_REMOVED
} = ChangesKinds;

const getReceivers = function({ newDoc: { users }, user }) {
  const executorId = (user === SystemName) ? user : user._id;

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
          template: {
            [FIELD_CHANGED]:
              `{{userName}} changed workflow type for ${label} ` +
              `from "{{oldValue}}" to "{{newValue}}" in {{{docDesc}}}`
          },
          templateData({ diffs, newDoc, user }) {
            const { newValue, oldValue } = diffs[
              `workflowDefaults.${field}.workflowType`
            ];

            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue,
              oldValue
            };
          },
          receivers: getReceivers
        }
      ]
    },

    {
      field: `workflowDefaults.${field}.stepTime.timeUnit`,
      logs: [],
      notifications: [
        {
          template: {
            [FIELD_CHANGED]:
              `{{userName}} changed default step time for ${label} ` +
              `from "{{oldValue}}" to "{{newValue}}" in {{{docDesc}}}`
          },
          templateData({ diffs, newDoc, user }) {
            const { newValue, oldValue } = diffs[
              `workflowDefaults.${field}.stepTime.timeUnit`
            ];

            const timeVal = newDoc.workflowDefaults[field].stepTime.timeValue;
            const newStepTime = `${timeVal} ${newValue}`;
            const oldStepTime = `${timeVal} ${oldValue}`;

            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: newStepTime,
              oldValue: oldStepTime
            };
          },
          receivers: getReceivers
        }
      ]
    },

    {
      field: `workflowDefaults.${field}.stepTime.timeValue`,
      logs: [],
      notifications: [
        {
          template: {
            [FIELD_CHANGED]:
              `{{userName}} changed default step time for ${label} ` +
              `from "{{oldValue}}" to "{{newValue}}" in {{{docDesc}}}`
          },
          templateData({ diffs, newDoc, user }) {
            const { newValue, oldValue } = diffs[
              `workflowDefaults.${field}.stepTime.timeValue`
            ];

            const timeUnit = newDoc.workflowDefaults[field].stepTime.timeUnit;
            const newStepTime = `${newValue} ${timeUnit}`;
            const oldStepTime = `${oldValue} ${timeUnit}`;

            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: newStepTime,
              oldValue: oldStepTime
            };
          },
          receivers: getReceivers
        }
      ]
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
            template: {
              [FIELD_CHANGED]:
                `{{userName}} changed ${reminderLabel} for ${label} ` +
                `from "{{oldValue}}" to "{{newValue}}" in {{{docDesc}}}`
            },
            templateData({ diffs, newDoc, user }) {
              const { newValue, oldValue } = diffs[
                `reminders.${field}.${reminderType}.timeValue`
              ];

              const timeUnit = newDoc.reminders[field][reminderType].timeUnit;
              const newStepTime = `${newValue} ${timeUnit}`;
              const oldStepTime = `${oldValue} ${timeUnit}`;

              return {
                docDesc: this.docDescription(newDoc),
                userName: getUserFullNameOrEmail(user),
                newValue: newStepTime,
                oldValue: oldStepTime
              };
            },
            receivers: getReceivers
          }
        ]
      },

      {
        field: `reminders.${field}.${reminderType}.timeUnit`,
        logs: [],
        notifications: [
          {
            template: {
              [FIELD_CHANGED]:
                `{{userName}} changed ${reminderLabel} for ${label} ` +
                `from "{{oldValue}}" to "{{newValue}}" in {{{docDesc}}}`
            },
            templateData({ diffs, newDoc, user }) {
              const { newValue, oldValue } = diffs[
                `reminders.${field}.${reminderType}.timeUnit`
              ];

              const timeValue = newDoc.reminders[field][reminderType].timeValue;
              const newStepTime = `${timeValue} ${newValue}`;
              const oldStepTime = `${timeValue} ${oldValue}`;

              return {
                docDesc: this.docDescription(newDoc),
                userName: getUserFullNameOrEmail(user),
                newValue: newStepTime,
                oldValue: oldStepTime
              };
            },
            receivers: getReceivers
          }
        ]
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
        template: {
          [FIELD_CHANGED]: `{{userName}} changed guidelines for ${label} in {{{docDesc}}}`
        },
        templateData({ newDoc, user }) {
          return {
            docDesc: this.docDescription(newDoc),
            userName: getUserFullNameOrEmail(user)
          };
        },
        receivers: getReceivers
      }
    ]
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
          template: {
            [FIELD_CHANGED]:
              '{{userName}} changed name of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"'
          },
          templateData({ diffs: { name }, oldDoc, user }) {
            return {
              docDesc: this.docDescription(oldDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: name.newValue,
              oldValue: name.oldValue
            };
          },
          receivers: getReceivers
        }
      ]
    },

    {
      field: 'timezone',
      logs: [],
      notifications: [
        {
          template: {
            [FIELD_CHANGED]:
              '{{userName}} changed timezone of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"'
          },
          templateData({ diffs: { timezone }, newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: timezone.newValue,
              oldValue: timezone.oldValue
            };
          },
          receivers: getReceivers
        }
      ]
    },

    {
      field: 'currency',
      logs: [],
      notifications: [
        {
          template: {
            [FIELD_CHANGED]:
              '{{userName}} changed currency of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"'
          },
          templateData({ diffs: { currency }, newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user),
              newValue: OrgCurrencies[currency.newValue],
              oldValue: OrgCurrencies[currency.oldValue]
            };
          },
          receivers: getReceivers
        }
      ]
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
          template: {
            [FIELD_CHANGED]: '{{userName}} changed risk scoring guidelines in {{{docDesc}}}'
          },
          templateData({ newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user)
            };
          },
          receivers: getReceivers
        }
      ]
    },

    {
      field: 'transfer',
      logs: [],
      notifications: [
        {
          shouldSendNotification({ diffs: { transfer: { kind } } }) {
            return kind === FIELD_ADDED;
          },
          template: {
            [FIELD_ADDED]:
              '{{userName}} invited you to become an owner of {{{docDesc}}}'
          },
          templateData({ newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user)
            };
          },
          subjectTemplate: 'You have been invited to become an organization owner',
          subjectTemplateData() { },
          notificationData({ diffs: { transfer: { newValue: { transferId } } } }) {
            return {
              templateData: {
                button: {
                  label: 'Confirm',
                  url: Meteor.absoluteUrl(`transfer-organization/${transferId}`)
                }
              }
            };
          },
          receivers({ diffs: { transfer: { newValue: { newOwnerId } } } }) {
            return [newOwnerId];
          }
        }
      ]
    },

    {
      field: 'users.$.role',
      logs: [],
      notifications: [
        {
          shouldSendNotification({ diffs, newDoc }) {
            const { newOwnerId } = newDoc.transfer || {};
            const { newValue:newRole, path } = diffs['users.$.role'];
            const { userId } = newDoc.users[parseInt(path[1])];

            console.log(newRole);
            console.log(newOwnerId);
            console.log(userId);

            return (newRole === UserMembership.ORG_OWNER) && (userId === newOwnerId);
          },
          template: {
            [FIELD_CHANGED]:
              '{{userName}} accepted the invitation to become an owner of {{{docDesc}}}'
          },
          templateData({ newDoc, user }) {
            return {
              docDesc: this.docDescription(newDoc),
              userName: getUserFullNameOrEmail(user)
            };
          },
          subjectTemplate: 'Organization transferred',
          subjectTemplateData() { },
          receivers({ newDoc }) {
            const { userId } = _(newDoc.users).find(({ role }) => {
              return role === UserMembership.ORG_OWNER;
            }) || {};

            console.log(userId);

            return [userId];
          }
        }
      ]
    },
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
