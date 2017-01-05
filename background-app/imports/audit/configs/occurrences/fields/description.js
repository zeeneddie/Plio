import { ChangesKinds } from '../../../utils/changes-kinds';
import { getLogData } from '../helpers';


export default {
  field: 'description',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: '{{{docName}}} description set',
        [ChangesKinds.FIELD_CHANGED]: '{{{docName}}} description changed',
        [ChangesKinds.FIELD_REMOVED]: '{{{docName}}} description removed',
      },
      logData: getLogData,
    },
  ],
  notifications: [],
  data() { },
};
