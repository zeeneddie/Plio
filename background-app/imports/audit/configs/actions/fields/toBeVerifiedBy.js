import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'toBeVerifiedBy',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'To be verified by set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'To be verified by changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'To be verified by removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set to be verified by of {{{docDesc}}} to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed to be verified by of {{{docDesc}}} from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed to be verified by of {{{docDesc}}}'
      }
    }
  ],
  data({ diffs: { toBeVerifiedBy }, newDoc, user }) {
    const { newValue, oldValue } = toBeVerifiedBy;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue)
    };
  },
  receivers({ diffs: { toBeVerifiedBy }, newDoc, user }) {
    const receivers = getReceivers(newDoc, user);
    const index = receivers.indexOf(toBeVerifiedBy.newValue);
    (index > -1) && receivers.splice(index, 1);

    return receivers;
  }
};
