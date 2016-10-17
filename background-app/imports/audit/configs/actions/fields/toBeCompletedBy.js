import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'toBeCompletedBy',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'To be completed by set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'To be completed by changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'To be completed by removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set to be completed by of {{{docDesc}}} to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed to be completed by of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed to be completed by of {{{docDesc}}}'
      }
    }
  ],
  data({ diffs: { toBeCompletedBy }, newDoc, user }) {
    const { newValue, oldValue } = toBeCompletedBy;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue)
    };
  },
  receivers({ diffs: { toBeCompletedBy }, newDoc, user }) {
    const receivers = getReceivers(newDoc, user);
    const index = receivers.indexOf(toBeCompletedBy.newValue);
    (index > -1) && receivers.splice(index, 1);

    return receivers;
  }
};
