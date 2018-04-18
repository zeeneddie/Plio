import { ActionStatuses } from '../../../../share/constants';
import { getReceivers } from '../helpers';
import status from '../../common/fields/status';

export default {
  field: 'status',
  logs: [
    status.logs.default,
  ],
  notifications: [],
  data({ diffs: { status: { newValue, oldValue } } }) {
    return {
      newValue: ActionStatuses[newValue],
      oldValue: ActionStatuses[oldValue],
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
