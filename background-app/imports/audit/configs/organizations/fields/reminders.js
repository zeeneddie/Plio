import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


const getRemindersConfig = (field, label) => {
  const getReminderConfig = (reminderType, reminderLabel) => {
    return [
      {
        field: `reminders.${field}.${reminderType}.timeValue`,
        logs: [],
        notifications: [
          {
            text: {
              [ChangesKinds.FIELD_CHANGED]:
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
              [ChangesKinds.FIELD_CHANGED]:
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

export default [
  ...getRemindersConfig('minorNc', 'minor non-conformities'),
  ...getRemindersConfig('majorNc', 'major non-conformities'),
  ...getRemindersConfig('criticalNc', 'critical non-conformities'),
  ...getRemindersConfig('improvementPlan', 'improvement plans')
];
