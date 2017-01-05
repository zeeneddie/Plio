import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate } from '../../../utils/helpers';


export default {
  field: 'improvementPlan.targetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Treatment plan target date for desired outcome set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Treatment plan target date for desired outcome changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Treatment plan target date for desired outcome removed',
      },
    },
  ],
  notifications: [],
  data({ diffs, organization }) {
    const { newValue, oldValue } = diffs['improvementPlan.targetDate'];
    const { timezone } = organization;

    return {
      newValue: () => getPrettyTzDate(newValue, timezone),
      oldValue: () => getPrettyTzDate(oldValue, timezone),
    };
  },
};
