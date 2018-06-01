import { getPrettyTzDate } from '/imports/helpers/date';
import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  logs: {
    default: {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Improvement plan target date for desired outcome set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Improvement plan target date for desired outcome changed from ' +
          '{{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Improvement plan target date for desired outcome removed',
      },
    },
  },
  notifications: {
    default: {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set improvement plan\'s target date for desired outcome of ' +
          '{{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed improvement plan\'s target date for desired outcome of ' +
          '{{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed improvement plan\'s target date for desired outcome of ' +
          '{{{docDesc}}} {{{docName}}}',
      },
    },
  },
  data({ diffs, organization }) {
    const { newValue, oldValue } = diffs['improvementPlan.targetDate'];
    const { timezone } = organization;

    return {
      newValue: () => getPrettyTzDate(newValue, timezone),
      oldValue: () => getPrettyTzDate(oldValue, timezone),
    };
  },
};
