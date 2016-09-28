import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getLogData } from '../helpers.js';


export default {
  field: 'description',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: '{{docDesc}} description set',
        [ChangesKinds.FIELD_CHANGED]: '{{docDesc}} description changed',
        [ChangesKinds.FIELD_REMOVED]: '{{docDesc}} description removed'
      },
      logData: getLogData
    }
  ],
  notifications: [],
  data({ newDoc }) {
    const auditConfig = this;
    return { docDesc: () => auditConfig.docDescription(newDoc), };
  }
};
