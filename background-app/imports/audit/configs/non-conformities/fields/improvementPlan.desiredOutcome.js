import { getReceivers } from '../../problems/helpers';
import IPDesiredOutcome from '../../common/fields/improvementPlan.desiredOutcome';


export default {
  field: 'improvementPlan.desiredOutcome',
  logs: [
    IPDesiredOutcome.logs.default,
  ],
  notifications: [
    IPDesiredOutcome.notifications.default,
  ],
  data() { },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
