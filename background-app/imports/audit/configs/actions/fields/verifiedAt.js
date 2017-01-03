import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail, getPrettyOrgDate } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'verifiedAt',
  logs: [
    {
      shouldCreateLog({ diffs: { isVerified } }) {
        return !isVerified;
      },
      message: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.verifiedAt.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.verifiedAt.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.verifiedAt.removed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { isVerified } }) {
        return !isVerified;
      },
      text: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.verifiedAt.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.verifiedAt.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.verifiedAt.text.removed',
      },
    },
  ],
  data({ diffs: { verifiedAt }, newDoc, user }) {
    const { newValue, oldValue } = verifiedAt;
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
