import { ChangesKinds } from '../../../utils/changes-kinds';

export default {
  logs: {
    default: {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Color set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Color changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Color removed',
      },
    },
  },
  notifications: {
    default: {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set color of {{{docDesc}}} {{{docName}}} to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed color of {{{docDesc}}} {{{docName}}} ' +
          'from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed color of {{{docDesc}}} {{{docName}}}',
      },
    },
  },
  data({ diffs: { color: { newValue, oldValue } } }) {
    return { newValue, oldValue };
  },
};
