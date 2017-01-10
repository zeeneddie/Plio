import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserId } from '../../../utils/helpers';
import { getUserFullNameOrEmail } from '/imports/share/helpers';


export default {
  logs: {
    default: {
      message: {
        [ChangesKinds.ITEM_ADDED]: '{{{user}}} was added to the notification list',
        [ChangesKinds.ITEM_REMOVED]: '{{{user}}} was removed from the notification list',
      },
    },
  },
  notifications: {
    default: {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{{userName}}} added {{{user}}} to the notification list of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.ITEM_REMOVED]:
          '{{{userName}}} removed {{{user}}} from the notification list of {{{docDesc}}} {{{docName}}}',
      },
    },
    personal: {
      shouldSendNotification({ diffs: { notify: { kind } } }) {
        return kind === ChangesKinds.ITEM_ADDED;
      },
      text: '{{{userName}}} added you to the notification list of {{{docDesc}}} {{{docName}}}',
      title: 'You have been added to the notification list',
      emailTemplateData({ newDoc, auditConfig }) {
        return {
          button: {
            label: 'View document',
            url: auditConfig.docUrl(newDoc),
          },
        };
      },
      receivers({ diffs: { notify }, user }) {
        const { item: addedUserId } = notify;
        const userId = getUserId(user);

        return (addedUserId !== userId) ? [addedUserId] : [];
      },
    },
  },
  data({ diffs: { notify } }) {
    return {
      user: () => getUserFullNameOrEmail(notify.item),
    };
  },
};
