import { getUserId } from '../../../utils/helpers';
import { getReceivers } from '../helpers';
import { getUserFullNameOrEmail } from '/imports/share/helpers';
import ownerId from '../../common/fields/ownerId';


export default {
  field: 'owner',
  logs: [
    ownerId.logs.default,
  ],
  notifications: [
    ownerId.notifications.default,
  ],
  data({ diffs: { owner } }) {
    const { newValue, oldValue } = owner;

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
  receivers({ newDoc, oldDoc, user }) {
    const { owner: oldOwner } = oldDoc;
    const { owner: newOwner } = newDoc;
    let receivers = getReceivers(newDoc, user);

    [oldOwner, newOwner].forEach((owner) => {
      if (owner !== getUserId(user)) {
        const index = receivers.indexOf(owner);

        if (index === -1) {
          receivers = [...receivers, owner];
        }
      }
    });

    return receivers;
  },
};
