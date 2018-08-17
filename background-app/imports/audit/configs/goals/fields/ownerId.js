import { getReceivers } from '../helpers';
import ownerId from '../../common/fields/ownerId';

export default {
  field: 'ownerId',
  logs: [
    ownerId.logs.default,
  ],
  notifications: [
    ownerId.notifications.default,
  ],
  data: ownerId.data,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
