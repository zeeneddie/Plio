import { ChangesKinds } from '../../../utils/changes-kinds';
import { getLogData } from '../helpers';


export default {
  field: 'notes',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: '{{docName}} notes set',
        [ChangesKinds.FIELD_CHANGED]: '{{docName}} notes changed',
        [ChangesKinds.FIELD_REMOVED]: '{{docName}} notes removed',
      },
      logData: getLogData,
    },
  ],
  notifications: [],
  data() { },
};
