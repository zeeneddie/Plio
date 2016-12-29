import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail, getPrettyOrgDate } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


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
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.completedAt.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.completedAt.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.completedAt.removed',
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
