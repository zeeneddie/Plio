import { ChangesKinds } from '../../../utils/changes-kinds';

export default {
  logs: {
    default: {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Notes set',
        [ChangesKinds.FIELD_CHANGED]: 'Notes changed',
        [ChangesKinds.FIELD_REMOVED]: 'Notes removed',
      },
    },
  },
  notifications: {
    default: {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set notes of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed notes of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed notes of {{{docDesc}}} {{{docName}}}',
      },
    },
  },
  data() { },
};
