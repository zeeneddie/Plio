import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail, getUserId } from '../../../utils/helpers.js';


export default {
  field: 'notify',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: '{{item}} was added to notification list',
        [ChangesKinds.ITEM_REMOVED]: '{{item}} was removed from notification list'
      }
    }
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { notify: { kind } } }) {
        return kind === ChangesKinds.ITEM_ADDED;
      },
      text: '{{userName}} added you to the notification list of {{{docDesc}}}',
      title: 'You have been added to the notification list',
      emailTemplateData({ newDoc }) {
        return {
          button: {
            label: 'View document',
            url: this.docUrl(newDoc)
          }
        };
      },
      receivers({ diffs: { notify }, user }) {
        const { item:addedUserId } = notify;
        const userId = getUserId(user);

        return (addedUserId !== userId) ? [addedUserId]: [];
      }
    }
  ],
  data({ diffs: { notify }, newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      item: () => getUserFullNameOrEmail(notify.item)
    };
  }
};
