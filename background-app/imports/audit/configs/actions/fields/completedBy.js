import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'completedBy',
  logs: [
    {
      shouldCreateLog({ diffs: { isCompleted } }) {
        return !isCompleted;
      },
      message: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.completedBy.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.completedBy.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.completedBy.removed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { isCompleted } }) {
        return !isCompleted;
      },
      text: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.completedBy.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.completedBy.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.completedBy.text.removed',
      },
    },
  ],
  data({ diffs: { completedBy }, newDoc, user }) {
    const { newValue, oldValue } = completedBy;
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
