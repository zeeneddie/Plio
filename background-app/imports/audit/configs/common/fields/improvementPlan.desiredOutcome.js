import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  logs: {
    default: {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Improvement plan statement of desired outcome set',
        [ChangesKinds.FIELD_CHANGED]:
          'Improvement plan statement of desired outcome changed',
        [ChangesKinds.FIELD_REMOVED]:
          'Improvement plan statement of desired outcome removed',
      },
    },
  },
  notifications: {
    default: {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set improvement plan\'s statement of desired outcome of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed improvement plan\'s statement of desired outcome of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed improvement plan\'s statement of desired outcome of {{{docDesc}}} {{{docName}}}',
      },
    },
  },
  data() { },
};
