import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';
import { capitalize } from '/imports/share/helpers.js';


const getRemindersConfig = (field, label) => {
  const getReminderConfig = (reminderType, reminderLabel) => {
    return [
      {
        field: `reminders.${field}.${reminderType}.timeValue`,
        logs: [
          {
            message: {
              [ChangesKinds.FIELD_CHANGED]:
                `${capitalize(reminderLabel)} for ${label} ` +
                `changed from "{{oldValue}}" to "{{newValue}}"`,
            }
          }
        ],
        notifications: [
          {
            text: {
              [ChangesKinds.FIELD_CHANGED]:
                `{{userName}} changed ${reminderLabel} for ${label} ` +
                `from "{{oldValue}}" to "{{newValue}}" in {{{docDesc}}} {{{docName}}}`
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
            docName: () => auditConfig.docName(newDoc),
            userName: () => getUserFullNameOrEmail(user),
            newValue: () => `${newValue} ${timeUnit}`,
            oldValue: () => `${oldValue} ${timeUnit}`
          };
        },
        receivers: getReceivers
      },

      {
        field: `reminders.${field}.${reminderType}.timeUnit`,
        logs: [
          {
            message: {
              [ChangesKinds.FIELD_CHANGED]:
                `${capitalize(reminderLabel)} for ${label} changed ` +
                `from "{{oldValue}}" to "{{newValue}}"`,
            }
          }
        ],
        notifications: [
          {
            text: {
              [ChangesKinds.FIELD_CHANGED]:
                `{{userName}} changed ${reminderLabel} for ${label} ` +
                `from "{{oldValue}}" to "{{newValue}}" in {{{docDesc}}} {{{docName}}}`
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
            docName: () => auditConfig.docName(newDoc),
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
  ...getRemindersConfig('minorNc', 'minor non-conformities/risks'),
  ...getRemindersConfig('majorNc', 'major non-conformities/risks'),
  ...getRemindersConfig('criticalNc', 'critical non-conformities/risks'),
  ...getRemindersConfig('improvementPlan', 'improvement plans')
];