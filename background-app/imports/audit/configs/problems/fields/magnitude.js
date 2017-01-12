import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'magnitude',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Magnitude set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Magnitude changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Magnitude removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set magnitude of {{{docDesc}}} {{{docName}}} to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed magnitude of {{{docDesc}}} {{{docName}}} from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed magnitude of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { magnitude: { newValue, oldValue } } }) {
    return { newValue, oldValue };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
