import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'improvementPlan.reviewDates',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]:
          'Improvement plan review date added: "{{date}}"',
        [ChangesKinds.ITEM_REMOVED]:
          'Improvement plan review date removed: "{{date}}"',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{userName}} added improvement plan\'s review date for {{{docDesc}}} {{{docName}}}: "{{date}}"',
        [ChangesKinds.ITEM_REMOVED]:
          '{{userName}} removed improvement plan\'s review date for {{{docDesc}}} {{{docName}}}: "{{date}}"',
      },
    },
  ],
  data({ diffs, organization }) {
    const { item: { date } } = diffs['improvementPlan.reviewDates'];
    const { timezone } = organization;

    return {
      date: () => getPrettyTzDate(date, timezone),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
