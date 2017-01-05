import { ChangesKinds } from '../../../utils/changes-kinds';
import { getLogData } from '../helpers';


export default {
  field: 'title',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          '{{docName}} title set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{docName}} title changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{docName}} title removed',
      },
      logData: getLogData,
    },
  ],
  notifications: [],
  data({ diffs: { title } }) {
    const { newValue, oldValue } = title;
    return { newValue, oldValue };
  },
};
