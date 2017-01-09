import { getReceivers } from '../../problems/helpers';
import IPReviewDate from '../../common/fields/improvementPlan.reviewDates.date';


export default {
  field: 'improvementPlan.reviewDates.$.date',
  logs: [
    IPReviewDate.logs.default,
  ],
  notifications: [
    IPReviewDate.notifications.default,
  ],
  data: IPReviewDate.data,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
