import { StandardStatuses } from '/imports/share/constants';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'status',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Status set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Status changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Status removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set status of {{{docDesc}}} {{{docName}}} to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed status of {{{docDesc}}} {{{docName}}} from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed status of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { status } }) {
    const { newValue, oldValue } = status;

    return {
      newValue: StandardStatuses[newValue],
      oldValue: StandardStatuses[oldValue],
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
