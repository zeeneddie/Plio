import { getReceivers, emailTemplateData } from '../helpers';
import description from '../../common/fields/description';

export default {
  field: 'description',
  logs: [
    description.logs.default,
  ],
  notifications: [
    description.notifications.default,
  ],
  data: description.data,
  emailTemplateData,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
