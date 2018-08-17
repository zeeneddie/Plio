import { GoalStatuses } from '../../../../share/constants';
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
      newValue: GoalStatuses[newValue],
      oldValue: GoalStatuses[oldValue],
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
