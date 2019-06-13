import { getReceivers } from '../helpers';
import originatorId from '../../common/fields/originatorId';

export default {
  field: 'originatorId',
  logs: [originatorId.logs.default],
  notifications: [originatorId.notifications.default],
  data: originatorId.data,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
