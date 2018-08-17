import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../../problems/helpers';


export default {
  field: 'cost',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Financial impact set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Financial impact changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Financial impact removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set financial impact of {{{docDesc}}} {{{docName}}} to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed financial impact of {{{docDesc}}} {{{docName}}} from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed financial impact of {{{docDesc}}} {{{docName}}}',
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
