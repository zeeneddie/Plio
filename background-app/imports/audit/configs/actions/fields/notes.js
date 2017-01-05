import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'notes',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Notes set',
        [ChangesKinds.FIELD_CHANGED]: 'Notes changed',
        [ChangesKinds.FIELD_REMOVED]: 'Notes removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set notes of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed notes of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed notes of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data() { },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
