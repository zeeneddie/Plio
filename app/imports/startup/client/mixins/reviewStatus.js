import { ReviewStatuses } from '../../../share/constants.js';
import { getClassByStatus } from '../../../client/react/reviews/helpers';

export default {
  getStatusName(status) {
    return ReviewStatuses[status];
  },
  getClassByStatus,
};
