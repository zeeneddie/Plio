import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail, getUserId } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'owner',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'standards.fields.owner.added',
        [ChangesKinds.FIELD_CHANGED]: 'standards.fields.owner.changed',
        [ChangesKinds.FIELD_REMOVED]: 'standards.fields.owner.removed',
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'standards.fields.owner.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'standards.fields.owner.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'standards.fields.owner.text.removed',
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
    const { owner:newOwner } = newDoc;
    const { owner:oldOwner } = oldDoc;
    const userId = getUserId(user);

    return _([newOwner, oldOwner]).filter((owner) => {
      return owner !== userId;
    });
  }
};
