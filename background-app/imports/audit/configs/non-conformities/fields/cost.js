import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../../problems/helpers';


export default {
  field: 'cost',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Approx cost per occurrence set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Approx cost per occurrence changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Approx cost per occurrence removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set approx cost per occurrence of {{{docDesc}}} {{{docName}}} to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed approx cost per occurrence of {{{docDesc}}} {{{docName}}} from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed approx cost per occurrence of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { cost: { newValue, oldValue } } }) {
    return { newValue, oldValue };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
