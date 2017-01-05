import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail, getUserId } from '../../../utils/helpers';


export default {
  field: 'notify',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: '{{user}} was added to notification list',
        [ChangesKinds.ITEM_REMOVED]: '{{user}} was removed from notification list',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { notify: { kind } } }) {
        return kind === ChangesKinds.ITEM_ADDED;
      },
      text: '{{userName}} added you to the notification list of {{{docDesc}}} {{{docName}}}',
      title: 'You have been added to the notification list',
      emailTemplateData({ newDoc }) {
        return {
          button: {
            label: 'View document',
            url: this.docUrl(newDoc),
          },
        };
      },
      receivers({ diffs: { notify }, user }) {
        const { item: addedUserId } = notify;
        const userId = getUserId(user);

        return (addedUserId !== userId) ? [addedUserId] : [];
      },
    },
  ],
  data({ diffs: { notify } }) {
    return {
      user: () => getUserFullNameOrEmail(notify.item),
    };
  },
};
