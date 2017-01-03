import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getLogData } from '../helpers.js';


export default {
  field: 'description',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'occurrences.fields.description.added',
        [ChangesKinds.FIELD_CHANGED]: 'occurrences.fields.description.changed',
        [ChangesKinds.FIELD_REMOVED]: 'occurrences.fields.description.removed',
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
