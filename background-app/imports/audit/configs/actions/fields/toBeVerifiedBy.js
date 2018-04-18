import { without } from 'ramda';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../../share/helpers';
import { getReceivers } from '../helpers';

export default {
  field: 'toBeVerifiedBy',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'To be verified by set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'To be verified by changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'To be verified by removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} assigned {{{newValue}}} to verify the {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} assigned {{{newValue}}} to verify the ' +
          '{{{docDesc}}} {{{docName}}} instead of {{{oldValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed {{{oldValue}}} from the verification process ' +
          'of the {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { toBeVerifiedBy } }) {
    const { newValue, oldValue } = toBeVerifiedBy;

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
  receivers({ diffs: { toBeVerifiedBy }, newDoc, user }) {
    const receivers = getReceivers(newDoc, user);
    return without(toBeVerifiedBy.newValue, receivers);
  },
};
