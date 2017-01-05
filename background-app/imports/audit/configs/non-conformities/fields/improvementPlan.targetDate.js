import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyOrgDate } from '../../../utils/helpers';


export default {
  field: 'improvementPlan.targetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Improvement plan target date for desired outcome set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Improvement plan target date for desired outcome changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Improvement plan target date for desired outcome removed',
      },
    },
  ],
  notifications: [],
  data({ diffs, organization }) {
    const { newValue, oldValue } = diffs['improvementPlan.targetDate'];
    const { timezone } = organization;

    return {
      newValue: () => getPrettyOrgDate(newValue, timezone),
      oldValue: () => getPrettyOrgDate(oldValue, timezone),
    };
  },
};
