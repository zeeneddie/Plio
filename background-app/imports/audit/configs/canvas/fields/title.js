import { getReceivers, emailTemplateData } from '../helpers';
import title from '../../common/fields/title';

export default {
  field: 'title',
  logs: [
    title.logs.default,
  ],
  notifications: [
    title.notifications.default,
  ],
  data: title.data,
  emailTemplateData,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
