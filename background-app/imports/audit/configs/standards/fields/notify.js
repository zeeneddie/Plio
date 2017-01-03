import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail, getUserId } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'notify',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'standards.fields.notify.item-added',
        [ChangesKinds.ITEM_REMOVED]: 'standards.fields.notify.item-removed',
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          'standards.fields.notify.doc-notification.text.item-added',
        [ChangesKinds.ITEM_REMOVED]:
          'standards.fields.notify.doc-notification.text.item-removed',
      }
    },
    {
      shouldSendNotification({ diffs: { notify: { kind } } }) {
        return kind === ChangesKinds.ITEM_ADDED;
      },
      text: 'standards.fields.notify.user-notification.text.item-added',
      title: 'standards.fields.notify.user-notification.title.item-added',
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
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      item: () => getUserFullNameOrEmail(notify.item)
    };
  },
  receivers: getReceivers
};
