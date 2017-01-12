import { getReceivers } from '../helpers';
import IPReviewDates from '../../common/fields/improvementPlan.reviewDates';


export default {
  field: 'improvementPlan.reviewDates',
  logs: [
    IPReviewDates.logs.default,
  ],
  notifications: [
    IPReviewDates.notifications.default,
  ],
  data: IPReviewDates.data,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
