import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '/imports/share/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'toBeVerifiedBy',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'To be verified by set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'To be verified by changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'To be verified by removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set to be verified by of {{{docDesc}}} {{{docName}}} to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed to be verified by of {{{docDesc}}} {{{docName}}} from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed to be verified by of {{{docDesc}}} {{{docName}}}',
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
    const index = receivers.indexOf(toBeVerifiedBy.newValue);

    return index > -1
      ? receivers.slice(0, index).concat(receivers.slice(index + 1))
      : receivers;
  },
};
