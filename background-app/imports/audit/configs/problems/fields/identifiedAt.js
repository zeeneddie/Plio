import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyTzDate } from '../../../utils/helpers';


export default {
  field: 'identifiedAt',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Identified at set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Identified at changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Identified at removed',
      },
    },
  ],
  notifications: [],
  data({ diffs: { identifiedAt }, organization: { timezone } }) {
    return {
      newValue: () => getPrettyTzDate(identifiedAt.newValue, timezone),
      oldValue: () => getPrettyTzDate(identifiedAt.oldValue, timezone),
    };
  },
};
