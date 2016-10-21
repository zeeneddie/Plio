import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'completedBy',
  logs: [
    {
      shouldCreateLog({ diffs: { isCompleted } }) {
        return !isCompleted;
      },
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Completed by set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Completed by changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Completed by removed'
      }
    }
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { isCompleted } }) {
        return !isCompleted;
      },
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set completed by of {{{docDesc}}} {{{docName}}} to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed completed by of {{{docDesc}}} {{{docName}}} from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed completed by of {{{docDesc}}} {{{docName}}}'
      }
    }
  ],
  data({ diffs: { completedBy }, newDoc, user }) {
    const { newValue, oldValue } = completedBy;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue)
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  }
};
