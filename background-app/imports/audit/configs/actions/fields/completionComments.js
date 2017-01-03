import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'completionComments',
  logs: [
    {
      shouldCreateLog({ diffs: { isCompleted } }) {
        return !isCompleted;
      },
      message: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.completionComments.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.completionComments.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.completionComments.removed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { isCompleted } }) {
        return !isCompleted;
      },
      text: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.completionComments.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.completionComments.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.completionComments.text.removed',
      },
    },
  ],
  data({ diffs: { completionComments }, newDoc, user }) {
    const { newValue, oldValue } = completionComments;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => newValue,
      oldValue: () => oldValue,
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
