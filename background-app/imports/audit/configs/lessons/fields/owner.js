import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getLogData } from '../helpers.js';


export default {
  field: 'owner',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          '{{docDesc}} owner set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{docDesc}} owner changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{docDesc}} owner removed'
      },
      logData: getLogData
    }
  ],
  notifications: [],
  data({ diffs: { owner }, newDoc }) {
    const auditConfig = this;
    const { newValue, oldValue } = owner;

    return {
      docName: () => auditConfig.docName(newDoc),
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue)
    };
  }
};
