import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '/imports/share/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'verifiedBy',
  logs: [
    {
      shouldCreateLog({ diffs: { isVerified } }) {
        return !isVerified;
      },
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Verified by set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Verified by changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Verified by removed',
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
          '{{{userName}}} set verified by of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed verified by of {{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed verified by of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { verifiedBy } }) {
    const { newValue, oldValue } = verifiedBy;

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
