import { getNotifications, getData, getReceivers } from '../helpers.js';


export default {
  field: 'assigneeId',
  logs: [],
  notifications: getNotifications(),
  data: getData,
  receivers: getReceivers
};
