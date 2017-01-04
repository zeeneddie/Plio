import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail, getUserId } from '../../../utils/helpers';


export default {
  field: 'notify',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'common.fields.notify.item-added',
        [ChangesKinds.ITEM_REMOVED]: 'common.fields.notify.item-removed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { notify: { kind } } }) {
        return kind === ChangesKinds.ITEM_ADDED;
      },
      text: 'common.fields.notify.user-notification.text.item-added',
      title: 'common.fields.notify.user-notification.title.item-added',
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
  data({ diffs: { notify }, newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      item: () => getUserFullNameOrEmail(notify.item),
    };
  },
};
