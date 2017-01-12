import { getNotifications, getData, getReceivers } from '../helpers';


export default {
  field: 'assigneeId',
  logs: [],
  notifications: getNotifications(),
  data: getData,
  receivers: getReceivers,
};
