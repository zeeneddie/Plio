import { getNotifications, getReceivers } from './helpers';
import WorkItemWorkflow from '../../../workflow/WorkItemWorkflow';

export default {
  logs: [],
  notifications: getNotifications(),
  receivers: getReceivers,
  trigger({ newDoc: { _id } }) {
    new WorkItemWorkflow(_id).refreshStatus();
  },
};
