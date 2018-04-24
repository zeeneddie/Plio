import { without } from 'ramda';
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
  receivers({ diffs: { notify: { item } }, newDoc, user }) {
    const receivers = getReceivers(newDoc, user);
    return without(item, receivers);
  },
};
