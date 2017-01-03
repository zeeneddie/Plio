import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail, getPrettyOrgDate } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'completedAt',
  logs: [
    {
      shouldCreateLog({ diffs: { isCompleted } }) {
        return !isCompleted;
      },
      message: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.completedAt.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.completedAt.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.completedAt.removed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { isCompleted } }) {
        return !isCompleted;
      },
      text: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.completedAt.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.completedAt.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.completedAt.text.removed',
      },
    },
  ],
  data({ diffs: { completedAt }, newDoc, user }) {
    const { newValue, oldValue } = completedAt;
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getPrettyOrgDate(newValue, orgId()),
      oldValue: () => getPrettyOrgDate(oldValue, orgId()),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
