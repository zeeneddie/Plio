import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  logs: {
    default: {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Description set',
        [ChangesKinds.FIELD_CHANGED]: 'Description changed',
        [ChangesKinds.FIELD_REMOVED]: 'Description removed',
      },
    },
  },
  notifications: {
    default: {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set description of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed description of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed description of {{{docDesc}}} {{{docName}}}',
      },
    },
  },
  data() { },
};
