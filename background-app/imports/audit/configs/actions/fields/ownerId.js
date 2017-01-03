import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';

export default {
  field: 'ownerId',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.ownerId.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.ownerId.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.ownerId.removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.ownerId.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.ownerId.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.ownerId.text.removed',
      },
    },
  ],
  data({ diffs: { ownerId }, newDoc, user }) {
    const { newValue, oldValue } = ownerId;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
