import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate } from '../../../utils/helpers';


export default {
  field: 'analysis.completedAt',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['analysis.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Root cause analysis date set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Root cause analysis date changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Root cause analysis date removed',
      },
    },
  ],
  notifications: [],
  data({ diffs, organization }) {
    const { newValue, oldValue } = diffs['analysis.completedAt'];
    const { timezone } = organization;

    return {
      newValue: () => getPrettyTzDate(newValue, timezone),
      oldValue: () => getPrettyTzDate(oldValue, timezone),
    };
  },
};
