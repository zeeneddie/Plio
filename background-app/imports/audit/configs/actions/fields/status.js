import { ChangesKinds } from '../../../utils/changes-kinds';
import { ActionStatuses } from '/imports/share/constants';
import { getReceivers } from '../helpers';


export default {
  field: 'status',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.status.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.status.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.status.removed',
      },
    },
  ],
  notifications: [],
  data({ diffs: { status } }) {
    const { newValue, oldValue } = status;

    return {
      newValue: () => ActionStatuses[newValue],
      oldValue: () => ActionStatuses[oldValue],
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
