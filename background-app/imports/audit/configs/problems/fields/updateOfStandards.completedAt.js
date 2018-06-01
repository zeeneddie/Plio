import { getPrettyTzDate } from '/imports/helpers/date';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'updateOfStandards.completedAt',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['updateOfStandards.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Approval date set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Approval date changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Approval date removed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs }) {
        return !diffs['updateOfStandards.status'];
      },
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set approval date of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed approval date ' +
          'of {{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed approval date of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs, organization }) {
    const { newValue, oldValue } = diffs['updateOfStandards.completedAt'];
    const { timezone } = organization;

    return {
      newValue: () => getPrettyTzDate(newValue, timezone),
      oldValue: () => getPrettyTzDate(oldValue, timezone),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
