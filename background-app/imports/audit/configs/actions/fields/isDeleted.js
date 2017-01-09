import { getReceivers } from '../helpers';
import ActionWorkflow from '/imports/workflow/ActionWorkflow';
import isDeleted from '../../common/fields/isDeleted';


export default {
  field: 'isDeleted',
  logs: [
    isDeleted.logs.default,
  ],
  notifications: [
    isDeleted.notifications.default,
  ],
  data: isDeleted.data,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
  trigger({ newDoc: { _id } }) {
    new ActionWorkflow(_id).refreshStatus();
  },
};
