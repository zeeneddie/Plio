import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';

export default {
  field: 'ownerId',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Owner set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]: 'Owner changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]: 'Owner removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set owner of {{{docDesc}}} {{{docName}}} to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed owner of {{{docDesc}}} {{{docName}}} from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed owner of {{{docDesc}}} {{{docName}}}'
      }
    }
  ],
  data({ diffs: { ownerId }, newDoc, user }) {
    const { newValue, oldValue } = ownerId;
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
