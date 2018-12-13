import { path } from 'ramda';

import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';
import { getPrettyTzDate } from '../../../../helpers/date';
import { getUserFullNameOrEmail, capitalize } from '../../../../share/helpers';

const getReviewReminderConfig = (field, type, label) => {
  const capitalizedField = capitalize(field);
  const logs = [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          `${label} for ${capitalizedField} review reminders set to {{{newValue}}}`,
        [ChangesKinds.FIELD_CHANGED]:
          `${label} for ${capitalizedField} review reminders changed ` +
          'from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          `${label} for ${capitalizedField} review reminders removed`,
      },
    },
  ];

  const notifications = [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          `{{{userName}}} set ${label} for ${capitalizedField} review reminders ` +
          'of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          `{{{userName}}} changed ${label} for ${capitalizedField} review reminders ` +
          'from {{{oldValue}}} to {{{newValue}}} in {{{docDesc}}} {{{docName}}}',
      },
    },
  ];

  return [
    {
      field: `review.${field}.reminders.${type}.timeValue`,
      logs,
      notifications,
      data({ diffs, newDoc, oldDoc }) {
        const getTimeUnit = path(['review', field, 'reminders', type, 'timeUnit']);
        const { newValue, oldValue } = diffs[`review.${field}.reminders.${type}.timeValue`];

        return {
          newValue: () => `${newValue} ${getTimeUnit(newDoc)}`,
          oldValue: () => `${oldValue} ${getTimeUnit(oldDoc)}`,
        };
      },
      receivers({ newDoc, user }) {
        return getReceivers(newDoc, user);
      },
    },
    {
      field: `review.${field}.reminders.${type}.timeUnit`,
      logs,
      notifications,
      data({ diffs, newDoc, oldDoc }) {
        const getTimeValue = path(['review', field, 'reminders', type, 'timeValue']);
        const { newValue, oldValue } = diffs[`review.${field}.reminders.${type}.timeUnit`];

        return {
          newValue: () => `${getTimeValue(newDoc)} ${newValue}`,
          oldValue: () => `${getTimeValue(oldDoc)} ${oldValue}`,
        };
      },
      receivers({ newDoc, user }) {
        return getReceivers(newDoc, user);
      },
    },
  ];
};

const getReviewConfig = (field) => {
  const capitalizedField = capitalize(field);

  return [
    {
      field: `review.${field}.reviewerId`,
      logs: [
        {
          message: {
            [ChangesKinds.FIELD_ADDED]:
              `${capitalizedField} reviewer set to {{{newValue}}}`,
            [ChangesKinds.FIELD_CHANGED]:
              `${capitalizedField} reviewer changed ` +
              'from {{{oldValue}}} to {{{newValue}}}',
            [ChangesKinds.FIELD_REMOVED]:
              `${capitalizedField} reviewer removed`,
          },
        },
      ],
      notifications: [
        {
          text: {
            [ChangesKinds.FIELD_ADDED]:
              `{{{userName}}} set ${capitalizedField} reviewer ` +
              'of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
            [ChangesKinds.FIELD_CHANGED]:
              `{{{userName}}} changed ${capitalizedField} reviewer ` +
              'from {{{oldValue}}} to {{{newValue}}} in {{{docDesc}}} {{{docName}}}',
          },
        },
      ],
      data({ diffs }) {
        const { newValue, oldValue } = diffs[`review.${field}.reviewerId`];

        return {
          newValue: () => getUserFullNameOrEmail(newValue),
          oldValue: () => getUserFullNameOrEmail(oldValue),
        };
      },
      receivers({ newDoc, user }) {
        return getReceivers(newDoc, user);
      },
    },
    {
      field: `review.${field}.annualDate`,
      logs: [
        {
          message: {
            [ChangesKinds.FIELD_ADDED]:
              `${capitalizedField} annual review date set to {{{newValue}}}`,
            [ChangesKinds.FIELD_CHANGED]:
              `${capitalizedField} annual review date changed ` +
              'from {{{oldValue}}} to {{{newValue}}}',
            [ChangesKinds.FIELD_REMOVED]:
              `${capitalizedField} annual review date removed`,
          },
        },
      ],
      notifications: [
        {
          text: {
            [ChangesKinds.FIELD_ADDED]:
              `{{{userName}}} set ${capitalizedField} annual review date ` +
              'of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
            [ChangesKinds.FIELD_CHANGED]:
              `{{{userName}}} changed ${capitalizedField} annual review date ` +
              'from {{{oldValue}}} to {{{newValue}}} in {{{docDesc}}} {{{docName}}}',
          },
        },
      ],
      data({ diffs, organization: { timezone } }) {
        const { newValue, oldValue } = diffs[`review.${field}.annualDate`];

        return {
          newValue: () => getPrettyTzDate(newValue, timezone),
          oldValue: () => getPrettyTzDate(oldValue, timezone),
        };
      },
      receivers({ newDoc, user }) {
        return getReceivers(newDoc, user);
      },
    },
    {
      field: `review.${field}.frequency.timeValue`,
      logs: [
        {
          message: {
            [ChangesKinds.FIELD_ADDED]:
              `${capitalizedField} review frequency set to {{{newValue}}}`,
            [ChangesKinds.FIELD_CHANGED]:
              `${capitalizedField} review frequency changed ` +
              'from {{{oldValue}}} to {{{newValue}}}',
            [ChangesKinds.FIELD_REMOVED]:
              `${capitalizedField} review frequency removed`,
          },
        },
      ],
      notifications: [
        {
          text: {
            [ChangesKinds.FIELD_ADDED]:
              `{{{userName}}} set ${capitalizedField} review frequency ` +
              'of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
            [ChangesKinds.FIELD_CHANGED]:
              `{{{userName}}} changed ${capitalizedField} review frequency ` +
              'from {{{oldValue}}} to {{{newValue}}} in {{{docDesc}}} {{{docName}}}',
          },
        },
      ],
      data({ diffs, newDoc, oldDoc }) {
        const getTimeUnit = path(['review', field, 'frequency', 'timeUnit']);
        const { newValue, oldValue } = diffs[`review.${field}.frequency.timeValue`];

        return {
          newValue: () => `${newValue} ${getTimeUnit(newDoc)}`,
          oldValue: () => `${oldValue} ${getTimeUnit(oldDoc)}`,
        };
      },
      receivers({ newDoc, user }) {
        return getReceivers(newDoc, user);
      },
    },
    ...getReviewReminderConfig(field, 'start', 'Advance notification timing'),
    ...getReviewReminderConfig(field, 'interval', 'Repeat notification timing'),
    ...getReviewReminderConfig(field, 'until', 'Notification stop timing'),
  ];
};

export default [
  ...getReviewConfig('standards'),
  ...getReviewConfig('risks'),
];
