import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  logs: {
    default: {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Notes set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]: 'Notes changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]: 'Notes removed',
      },
    },
  },
  notifications: {
    default: {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set notes of {{{docDesc}}} {{{docName}}} to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed notes of {{{docDesc}}} {{{docName}}} ' +
          'from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed notes of {{{docDesc}}} {{{docName}}}',
      },
    },
  },
  data({ diffs: { notes } }) {
    return {
      newValue: notes.newValue,
      oldValue: notes.oldValue,
    };
  },
};
