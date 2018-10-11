import { getReceivers } from '../helpers';
import { matchedTo } from '../../canvas/fields/common';

export default {
  field: 'matchedTo',
  logs: [matchedTo.logs.default],
  notifications: [matchedTo.notifications.default],
  data: matchedTo.data,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
