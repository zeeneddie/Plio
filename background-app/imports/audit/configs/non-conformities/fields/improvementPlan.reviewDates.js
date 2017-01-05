import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate } from '../../../utils/helpers';


export default {
  field: 'improvementPlan.reviewDates',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'Improvement plan review date added: "{{date}}"',
        [ChangesKinds.ITEM_REMOVED]: 'Improvement plan review date removed: "{{date}}"',
      },
    },
  ],
  notifications: [],
  data({ diffs, organization }) {
    const { item: { date } } = diffs['improvementPlan.reviewDates'];
    const { timezone } = organization;

    return {
      date: () => getPrettyTzDate(date, timezone),
    };
  },
};
