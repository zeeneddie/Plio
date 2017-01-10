import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


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
        [ChangesKinds.FIELD_REMOVED]: 'Verification comments removed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { isVerified } }) {
        return !isVerified;
      },
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set verification comments of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed verification comments of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed verification comments of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data() { },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
