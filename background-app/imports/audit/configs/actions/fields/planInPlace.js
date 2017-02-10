import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'planInPlace',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Plan in place set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Plan in place changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Plan in place removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set plan in place of {{{docDesc}}} {{{docName}}} to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed plan in place of {{{docDesc}}} {{{docName}}} from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed plan in place of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { planInPlace } }) {
    const { newValue, oldValue } = planInPlace;
    return { newValue, oldValue };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
