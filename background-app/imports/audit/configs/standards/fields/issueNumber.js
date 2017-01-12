import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'issueNumber',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Issue number set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Issue number changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Issue number removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set issue number of {{{docDesc}}} {{{docName}}} to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed issue number of {{{docDesc}}} {{{docName}}} from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed issue number of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { issueNumber } }) {
    const { newValue, oldValue } = issueNumber;
    return { newValue, oldValue };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
