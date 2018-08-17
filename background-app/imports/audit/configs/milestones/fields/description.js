import description from '../../common/fields/description';
import { getReceivers } from '../helpers';

export default {
  field: 'description',
  logs: [
    description.logs.default,
  ],
  notifications: [
    description.notifications.default,
  ],
  data: description.data,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
