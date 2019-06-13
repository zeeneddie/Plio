import { getReceivers, emailTemplateData } from '../helpers';
import notify from '../../common/fields/notify';

export default {
  field: 'notify',
  logs: [notify.logs.default],
  notifications: [
    notify.notifications.default,
    notify.notifications.personal,
  ],
  data: notify.data,
  emailTemplateData,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
