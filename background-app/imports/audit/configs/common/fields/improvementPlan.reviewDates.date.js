import { getPrettyTzDate } from '/imports/helpers/date';
import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  logs: {
    default: {
      message: {
        [ChangesKinds.FIELD_CHANGED]:
          'Improvement plan review date changed from {{{oldValue}}} to {{{newValue}}}',
      },
    },
  },
  notifications: {
    default: {
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed improvement plan\'s review date for ' +
          '{{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
      },
    },
  },
  data({ diffs, organization }) {
    const { newValue, oldValue } = diffs['improvementPlan.reviewDates.$.date'];
    const { timezone } = organization;

    return {
      newValue: () => getPrettyTzDate(newValue, timezone),
      oldValue: () => getPrettyTzDate(oldValue, timezone),
    };
  },
};
