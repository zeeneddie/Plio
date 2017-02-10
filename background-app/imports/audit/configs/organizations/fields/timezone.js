import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'timezone',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Timezone set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Timezone changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Timezone removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set timezone of {{{docDesc}}} {{{docName}}} to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed timezone of {{{docDesc}}} {{{docName}}} from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed timezone of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { timezone } }) {
    const { newValue, oldValue } = timezone;
    return { newValue, oldValue };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
