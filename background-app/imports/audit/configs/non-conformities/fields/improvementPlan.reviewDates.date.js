import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate } from '../../../utils/helpers';


export default {
  field: 'improvementPlan.reviewDates.$.date',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_CHANGED]:
          'Improvement plan review date changed from "{{oldValue}}" to "{{newValue}}"',
      },
    },
  ],
  notifications: [],
  data({ diffs, organization }) {
    const { newValue, oldValue } = diffs['improvementPlan.reviewDates.$.date'];
    const { timezone } = organization;

    return {
      newValue: () => getPrettyTzDate(newValue, timezone),
      oldValue: () => getPrettyTzDate(oldValue, timezone),
    };
  },
};
