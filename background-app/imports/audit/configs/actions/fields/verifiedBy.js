import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'verifiedBy',
  logs: [
    {
      shouldCreateLog({ diffs: { isVerified } }) {
        return !isVerified;
      },
      message: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.verifiedBy.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.verifiedBy.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.verifiedBy.removed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { isVerified } }) {
        return !isVerified;
      },
      text: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.verifiedBy.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.verifiedBy.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.verifiedBy.text.removed',
      },
    },
  ],
  data({ diffs: { verifiedBy }, newDoc, user }) {
    const { newValue, oldValue } = verifiedBy;
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
