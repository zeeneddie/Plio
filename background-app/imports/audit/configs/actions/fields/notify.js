import { getReceivers } from '../helpers';
import notify from '../../common/fields/notify';


export default {
  field: 'notify',
  logs: [
    notify.logs.default,
  ],
  notifications: [
    notify.notifications.default,
    notify.notifications.personal,
  ],
  data: notify.data,
  receivers({ diffs: { notify }, newDoc, user }) {
    const receivers = getReceivers(newDoc, user);
    const index = receivers.indexOf(notify.item);

    return index > -1
      ? receivers.slice(0, index).concat(receivers.slice(index + 1))
      : receivers;
  },
};
