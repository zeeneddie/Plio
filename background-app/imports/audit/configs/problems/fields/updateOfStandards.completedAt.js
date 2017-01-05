import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate } from '../../../utils/helpers';


export default {
  field: 'updateOfStandards.completedAt',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['updateOfStandards.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Update of standards date set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Update of standards date changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Update of standards date removed',
      },
    },
  ],
  notifications: [],
  data({ diffs, organization }) {
    const { newValue, oldValue } = diffs['updateOfStandards.completedAt'];
    const { timezone } = organization;

    return {
      newValue: () => getPrettyTzDate(newValue, timezone),
      oldValue: () => getPrettyTzDate(oldValue, timezone),
    };
  },
};
