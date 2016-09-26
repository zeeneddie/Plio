import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'verificationComments',
  logs: [
    {
      shouldCreateLog({ diffs: { isVerified } }) {
        return !isVerified;
      },
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Verification comments set',
        [ChangesKinds.FIELD_CHANGED]: 'Verification comments changed',
        [ChangesKinds.FIELD_REMOVED]: 'Verification comments removed'
      }
    }
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { isVerified } }) {
        return !isVerified;
      },
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set verification comments of {{{docDesc}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed verification comments of {{{docDesc}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed verification comments of {{{docDesc}}}'
      }
    }
  ],
  data({ diffs: { verificationComments }, newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user),
    };
  },
  receivers: getReceivers
};
