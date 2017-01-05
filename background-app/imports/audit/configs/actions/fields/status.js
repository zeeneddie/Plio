import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { ActionStatuses } from '/imports/share/constants.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'status',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Status set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]: 'Status changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]: 'Status removed'
      }
    }
  ],
  notifications: [],
  data({ diffs: { status } }) {
    const { newValue, oldValue } = status;

    return {
      newValue: () => ActionStatuses[newValue],
      oldValue: () => ActionStatuses[oldValue]
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  }
};
