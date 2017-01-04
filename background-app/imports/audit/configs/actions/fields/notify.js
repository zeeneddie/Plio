import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail, getUserId } from '../../../utils/helpers';
import { getReceivers } from '../helpers';

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
      text: {
        [ChangesKinds.ITEM_ADDED]:
          'common.fields.notify.doc-notification.text.item-added',
        [ChangesKinds.ITEM_REMOVED]:
          'common.fields.notify.doc-notification.text.item-removed',
      },
    },
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
  receivers({ diffs: { notify }, newDoc, user }) {
    const receivers = getReceivers(newDoc, user);
    const index = receivers.indexOf(notify.item);
    (index > -1) && receivers.splice(index, 1);

    return receivers;
  },
};
