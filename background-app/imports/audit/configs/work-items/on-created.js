import { getNotifications, getData, getReceivers } from './helpers.js';


export default {
  logs: [],
  notifications: getNotifications(),
  data: getData,
  receivers: getReceivers
};
