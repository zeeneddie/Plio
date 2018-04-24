import onRemoved from '../common/on-removed';
import { getReceivers, getLinkedDocNotificationData } from './helpers';

export default {
  logs: [
    onRemoved.logs.default,
  ],
  notifications: [
    {
      text: '{{{userName}}} removed {{{docDesc}}} {{{docName}}} ' +
        'from {{{linkedDocDesc}}} {{{linkedDocName}}}',
      data: getLinkedDocNotificationData,
      receivers({ oldDoc, user }) {
        return getReceivers(oldDoc, user);
      },
    },
  ],
};
