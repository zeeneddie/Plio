import { getNotifications, getData, getReceivers } from './helpers.js';
import WorkItemWorkflow from '/imports/workflow/WorkItemWorkflow.js';


export default {
  logs: [],
  notifications: getNotifications(),
  data: getData,
  receivers: getReceivers,
  triggers: [
    function({ newDoc: { _id } }) {
      new WorkItemWorkflow(_id).refreshStatus();
    }
  ]
};
