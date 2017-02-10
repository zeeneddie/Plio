import { getReceivers } from '../helpers';
import departmentsIds from '../../common/fields/departmentsIds';


export default {
  field: 'departmentsIds',
  logs: [
    departmentsIds.logs.default,
  ],
  notifications: [
    departmentsIds.notifications.default,
  ],
  data: departmentsIds.data,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
