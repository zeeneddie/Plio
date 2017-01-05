import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';
import { capitalize } from '/imports/share/helpers';


const getRemindersConfig = (field, relatedDocs) => {
  const getReminderConfig = (reminderType, reminderLabel) => {
    return [
      {
        field: `reminders.${field}.${reminderType}.timeValue`,
        logs: [
          {
            message: {
              [ChangesKinds.FIELD_CHANGED]:
                '{{reminderLabel}} for {{relatedDocs}} ' +
                'changed from "{{oldValue}}" to "{{newValue}}"',
            },
          },
        ],
        notifications: [
          {
            text: {
              [ChangesKinds.FIELD_CHANGED]:
                '{{userName}} changed {{reminderLabel}} for {{relatedDocs}} ' +
                'from "{{oldValue}}" to "{{newValue}}" in {{{docDesc}}} {{{docName}}}',
            },
          },
        ],
        data({ diffs, newDoc }) {
          const { newValue, oldValue } = diffs[
            `reminders.${field}.${reminderType}.timeValue`
          ];
          const timeUnit = newDoc.reminders[field][reminderType].timeUnit;

          return {
            newValue: `${newValue} ${timeUnit}`,
            oldValue: `${oldValue} ${timeUnit}`,
            reminderLabel: capitalize(reminderLabel),
            relatedDocs,
          };
        },
        receivers({ newDoc, user }) {
          return getReceivers(newDoc, user);
        },
      },

      {
        field: `reminders.${field}.${reminderType}.timeUnit`,
        logs: [
          {
            message: {
              [ChangesKinds.FIELD_CHANGED]:
                '{{reminderLabel}} for {{relatedDocs}} ' +
                'changed from "{{oldValue}}" to "{{newValue}}"',
            },
          },
        ],
        notifications: [
          {
            text: {
              [ChangesKinds.FIELD_CHANGED]:
                '{{userName}} changed {{reminderLabel}} for {{relatedDocs}} ' +
                'from "{{oldValue}}" to "{{newValue}}" in {{{docDesc}}} {{{docName}}}',
            },
          },
        ],
        data({ diffs, newDoc }) {
          const { newValue, oldValue } = diffs[
            `reminders.${field}.${reminderType}.timeUnit`
          ];
          const timeValue = newDoc.reminders[field][reminderType].timeValue;

          return {
            newValue: () => `${timeValue} ${newValue}`,
            oldValue: () => `${timeValue} ${oldValue}`,
            reminderLabel: capitalize(reminderLabel),
            relatedDocs,
          };
        },
        receivers({ newDoc, user }) {
          return getReceivers(newDoc, user);
        },
      },
    ];
  };

  return [
    ...getReminderConfig('start', 'reminder start time'),
    ...getReminderConfig('interval', 'reminder interval'),
    ...getReminderConfig('until', 'reminder end time'),
  ];
};

export default [
  ...getRemindersConfig('minorNc', 'minor non-conformities/risks'),
  ...getRemindersConfig('majorNc', 'major non-conformities/risks'),
  ...getRemindersConfig('criticalNc', 'critical non-conformities/risks'),
  ...getRemindersConfig('improvementPlan', 'improvement plans'),
];
