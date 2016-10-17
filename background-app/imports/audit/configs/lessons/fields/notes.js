import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getLogData } from '../helpers.js';


export default {
  field: 'notes',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: '{{docDesc}} notes set',
        [ChangesKinds.FIELD_CHANGED]: '{{docDesc}} notes changed',
        [ChangesKinds.FIELD_REMOVED]: '{{docDesc}} notes removed'
      },
      logData: getLogData
    }
  ],
  notifications: [],
  data({ newDoc }) {
    const auditConfig = this;
    return { docDesc: () => auditConfig.docDescription(newDoc) };
  }
};
