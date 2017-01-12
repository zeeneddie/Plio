import { getReceivers } from '../../problems/helpers';
import IPOwner from '../../common/fields/improvementPlan.owner';


export default {
  field: 'improvementPlan.owner',
  logs: [
    IPOwner.logs.default,
  ],
  notifications: [
    IPOwner.notifications.default,
    IPOwner.notifications.personal,
  ],
  data: IPOwner.data,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
