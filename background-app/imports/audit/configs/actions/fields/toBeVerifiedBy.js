import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'toBeVerifiedBy',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.toBeVerifiedBy.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.toBeVerifiedBy.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.toBeVerifiedBy.removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.toBeVerifiedBy.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.toBeVerifiedBy.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.toBeVerifiedBy.text.removed',
      },
    },
  ],
  data({ diffs: { toBeVerifiedBy }, newDoc, user }) {
    const { newValue, oldValue } = toBeVerifiedBy;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
  receivers({ diffs: { toBeVerifiedBy }, newDoc, user }) {
    const receivers = getReceivers(newDoc, user);
    const index = receivers.indexOf(toBeVerifiedBy.newValue);
    (index > -1) && receivers.splice(index, 1);

    return receivers;
  },
};
