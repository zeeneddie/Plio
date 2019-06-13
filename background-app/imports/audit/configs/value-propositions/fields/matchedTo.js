import { getReceivers } from '../helpers';
import { matchedTo } from '../../canvas/fields/common';
import { emailTemplateData } from '../../canvas/helpers';

export default {
  field: 'matchedTo',
  logs: [matchedTo.logs.default],
  notifications: [matchedTo.notifications.default],
  data: matchedTo.data,
  emailTemplateData,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
