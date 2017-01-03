import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'verificationComments',
  logs: [
    {
      shouldCreateLog({ diffs: { isVerified } }) {
        return !isVerified;
      },
      message: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.verificationComments.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.verificationComments.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.verificationComments.removed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { isVerified } }) {
        return !isVerified;
      },
      text: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.verificationComments.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.verificationComments.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.verificationComments.text.removed',
      },
    },
  ],
  data({ newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
