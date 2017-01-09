import { getReceivers } from '../helpers';
import IPDesiredOutcome from '../../common/fields/improvementPlan.desiredOutcome';


export default {
  field: 'improvementPlan.desiredOutcome',
  logs: [
    IPDesiredOutcome.logs.default,
  ],
  notifications: [
    IPDesiredOutcome.notifications.default,
  ],
  data: IPDesiredOutcome.data,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
