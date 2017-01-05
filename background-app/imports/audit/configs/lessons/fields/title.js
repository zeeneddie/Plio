import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getLogData } from '../helpers.js';


export default {
  field: 'title',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          '{{docDesc}} title set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{docDesc}} title changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{docDesc}} title removed'
      },
      logData: getLogData
    }
  ],
  notifications: [],
  data({ diffs: { title }, newDoc }) {
    const auditConfig = this;
    const { newValue, oldValue } = title;

    return {
      docName: () => auditConfig.docName(newDoc),
      newValue: () => newValue,
      oldValue: () => oldValue
    };
  }
};
