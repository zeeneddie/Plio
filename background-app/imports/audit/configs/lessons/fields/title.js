import { ChangesKinds } from '../../../utils/changes-kinds';
import { getLogData } from '../helpers';


export default {
  field: 'title',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'lessons.fields.title.added',
        [ChangesKinds.FIELD_CHANGED]: 'lessons.fields.title.changed',
        [ChangesKinds.FIELD_REMOVED]: 'lessons.fields.title.removed',
      },
      logData: getLogData,
    },
  ],
  notifications: [],
  data({ diffs: { title }, newDoc }) {
    const auditConfig = this;
    const { newValue, oldValue } = title;

    return {
      docName: () => auditConfig.docName(newDoc),
      newValue: () => newValue,
      oldValue: () => oldValue,
    };
  },
};
