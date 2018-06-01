import { getPrettyTzDate } from '/imports/helpers/date';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'completedAt',
  logs: [
    {
      shouldCreateLog({ diffs: { isCompleted } }) {
        return !isCompleted;
      },
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Completion date set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Completion date changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Completion date removed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { isCompleted } }) {
        return !isCompleted;
      },
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set completion date of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed completion date ' +
          'of {{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed completion date of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { completedAt }, organization }) {
    const { newValue, oldValue } = completedAt;
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
