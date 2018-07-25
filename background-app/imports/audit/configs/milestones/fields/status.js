import { MilestoneStatuses } from '../../../../share/constants';
import status from '../../common/fields/status';

export default {
  field: 'status',
  logs: [
    status.logs.default,
  ],
  notifications: [],
  data({ diffs: { status: { newValue, oldValue } } }) {
    return {
      newValue: MilestoneStatuses[newValue],
      oldValue: MilestoneStatuses[oldValue],
    };
  },
};
