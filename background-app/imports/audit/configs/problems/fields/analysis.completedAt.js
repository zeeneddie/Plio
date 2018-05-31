import { getPrettyTzDate } from '/imports/helpers/date';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'analysis.completedAt',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['analysis.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Root cause analysis date set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Root cause analysis date changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Root cause analysis date removed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs }) {
        return !diffs['analysis.status'];
      },
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set root cause analysis date ' +
          'of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed root cause analysis date ' +
          'of {{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed root cause analysis date ' +
          'of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs, organization }) {
    const { newValue, oldValue } = diffs['analysis.completedAt'];
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
