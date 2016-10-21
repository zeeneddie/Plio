import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getLogData } from '../helpers.js';


export default {
  field: 'description',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: '{{{docName}}} description set',
        [ChangesKinds.FIELD_CHANGED]: '{{{docName}}} description changed',
        [ChangesKinds.FIELD_REMOVED]: '{{{docName}}} description removed'
      },
      logData: getLogData
    }
  ],
  notifications: [],
  data({ newDoc }) {
    const auditConfig = this;
    return { docName: () => auditConfig.docName(newDoc) };
  }
};
