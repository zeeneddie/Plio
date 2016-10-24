import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'verifiedBy',
  logs: [
    {
      shouldCreateLog({ diffs: { isVerified } }) {
        return !isVerified;
      },
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Verified by set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Verified by changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Verified by removed'
      }
    }
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { isVerified } }) {
        return !isVerified;
      },
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set verified by of {{{docDesc}}} {{{docName}}} to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed verified by of {{{docDesc}}} {{{docName}}} from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed verified by of {{{docDesc}}} {{{docName}}}'
      }
    }
  ],
  data({ diffs: { verifiedBy }, newDoc, user }) {
    const { newValue, oldValue } = verifiedBy;
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
