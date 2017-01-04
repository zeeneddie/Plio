import { getNotifications, getData, getReceivers } from './helpers';
import WorkItemWorkflow from '/imports/workflow/WorkItemWorkflow';


export default {
  logs: [],
  notifications: getNotifications(),
  data: getData,
  receivers: getReceivers,
  triggers: [
    function ({ newDoc: { _id } }) {
      new WorkItemWorkflow(_id).refreshStatus();
    },
  ],
};
