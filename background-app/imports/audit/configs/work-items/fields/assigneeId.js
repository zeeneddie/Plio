import { getNotifications, getReceivers } from '../helpers';


export default {
  field: 'assigneeId',
  logs: [],
  notifications: getNotifications(),
  receivers: getReceivers,
};
