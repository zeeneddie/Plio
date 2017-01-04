import { _ } from 'meteor/underscore';

import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail, getUserId } from '../../../utils/helpers';


export default {
  field: 'owner',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'common.fields.ownerId.added',
        [ChangesKinds.FIELD_CHANGED]: 'common.fields.ownerId.changed',
        [ChangesKinds.FIELD_REMOVED]: 'common.fields.ownerId.removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'common.fields.ownerId.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'common.fields.ownerId.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'common.fields.ownerId.text.removed',
      },
    },
  ],
  data({ diffs: { owner }, newDoc, user }) {
    const { newValue, oldValue } = owner;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
  receivers({ newDoc, oldDoc, user }) {
    const { owner: newOwner } = newDoc;
    const { owner: oldOwner } = oldDoc;
    const userId = getUserId(user);

    return _([newOwner, oldOwner]).filter((owner) => owner !== userId);
  },
};
