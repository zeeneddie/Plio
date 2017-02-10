import { getReceivers } from '../helpers';
import IPTargetDate from '../../common/fields/improvementPlan.targetDate';


export default {
  field: 'improvementPlan.targetDate',
  logs: [
    IPTargetDate.logs.default,
  ],
  notifications: [
    IPTargetDate.notifications.default,
  ],
  data: IPTargetDate.data,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
