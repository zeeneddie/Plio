import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate } from '../../../../helpers/date';
import { getReceivers } from '../helpers';

export default {
  field: 'startDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Start date set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Start date changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Start date removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set start date of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed start date of {{{docDesc}}} {{{docName}}} ' +
          'from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed start date of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { startDate }, organization }) {
    const { newValue, oldValue } = startDate;
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
