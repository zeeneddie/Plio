import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getLogData } from '../helpers.js';


export default {
  field: 'notes',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'lessons.fields.notes.added',
        [ChangesKinds.FIELD_CHANGED]: 'lessons.fields.notes.changed',
        [ChangesKinds.FIELD_REMOVED]: 'lessons.fields.notes.removed',
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
