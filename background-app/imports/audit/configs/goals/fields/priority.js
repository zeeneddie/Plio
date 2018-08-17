import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';

export default {
  field: 'priority',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Priority set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Priority changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Priority removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set priority of {{{docDesc}}} {{{docName}}} to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed priority of {{{docDesc}}} {{{docName}}} ' +
          'from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed priority of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { priority: { newValue, oldValue } } }) {
    return { newValue, oldValue };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
