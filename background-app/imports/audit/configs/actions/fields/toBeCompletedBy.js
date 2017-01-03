import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'toBeCompletedBy',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.toBeCompletedBy.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.toBeCompletedBy.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.toBeCompletedBy.removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.toBeCompletedBy.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.toBeCompletedBy.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.toBeCompletedBy.text.removed',
      },
    },
  ],
  data({ diffs: { toBeCompletedBy }, newDoc, user }) {
    const { newValue, oldValue } = toBeCompletedBy;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
  receivers({ diffs: { toBeCompletedBy }, newDoc, user }) {
    const receivers = getReceivers(newDoc, user);
    const index = receivers.indexOf(toBeCompletedBy.newValue);
    (index > -1) && receivers.splice(index, 1);

    return receivers;
  },
};
