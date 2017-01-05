import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate } from '../../../utils/helpers';


export default {
  field: 'review.reviewedAt',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Review date set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Review date changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Review date removed',
      },
    },
  ],
  notifications: [],
  data({ diffs, organization }) {
    const { newValue, oldValue } = diffs['review.reviewedAt'];
    const { timezone } = organization;

    return {
      newValue: getPrettyTzDate(newValue, timezone),
      oldValue: getPrettyTzDate(oldValue, timezone),
    };
  },
};
