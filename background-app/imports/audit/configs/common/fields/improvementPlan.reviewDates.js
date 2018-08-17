import { getPrettyTzDate } from '/imports/helpers/date';
import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  logs: {
    default: {
      message: {
        [ChangesKinds.ITEM_ADDED]:
          'Improvement plan review date added: {{{date}}}',
        [ChangesKinds.ITEM_REMOVED]:
          'Improvement plan review date removed: {{{date}}}',
      },
    },
  },
  notifications: {
    default: {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{{userName}}} added improvement plan\'s review date for ' +
          '{{{docDesc}}} {{{docName}}}: {{{date}}}',
        [ChangesKinds.ITEM_REMOVED]:
          '{{{userName}}} removed improvement plan\'s review date for ' +
          '{{{docDesc}}} {{{docName}}}: {{{date}}}',
      },
    },
  },
  data({ diffs, organization }) {
    const { item: { date } } = diffs['improvementPlan.reviewDates'];
    const { timezone } = organization;

    return {
      date: () => getPrettyTzDate(date, timezone),
    };
  },
};
