import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail, getUserId } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'owner',
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
  data({ diffs: { owner }, newDoc, user }) {
    const { newValue, oldValue } = owner;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue)
    };
  },
  receivers({ newDoc, oldDoc, user }) {
    const { owner:oldOwner } = oldDoc;
    const { owner:newOwner } = newDoc;
    let receivers = getReceivers({ newDoc, user });

    [oldOwner, newOwner].forEach((owner) => {
      if (owner !== getUserId(user)) {
        const index = receivers.indexOf(owner);

        if (index === -1) {
          receivers = [...receivers, owner];
        }
      }
    });

    return receivers;
  }
};
