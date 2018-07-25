import { getPrettyTzDate } from '/imports/helpers/date';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getLogData } from '../helpers';


export default {
  field: 'date',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{docName}}} created date set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{docName}}} created date changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{docName}}} created date removed',
      },
      logData: getLogData,
    },
  ],
  notifications: [],
  data({ diffs: { date }, organization }) {
    const { newValue, oldValue } = date;
    const { timezone } = organization;

    return {
      newValue: () => getPrettyTzDate(newValue, timezone),
      oldValue: () => getPrettyTzDate(oldValue, timezone),
    };
  },
};
