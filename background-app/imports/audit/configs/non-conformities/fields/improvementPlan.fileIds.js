import { getReceivers } from '../../problems/helpers';
import IPFileIds from '../../common/fields/improvementPlan.fileIds';


export default {
  field: 'improvementPlan.fileIds',
  logs: [
    IPFileIds.logs.default,
  ],
  notifications: [
    IPFileIds.notifications.default,
  ],
  data: IPFileIds.data,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
