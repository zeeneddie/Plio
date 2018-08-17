import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '/imports/share/helpers';
import { getUserId } from '../../../utils/helpers';


export default {
  logs: {
    default: {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Owner set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]: 'Owner changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]: 'Owner removed',
      },
    },
  },
  notifications: {
    default: {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set owner of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed owner of {{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed owner of {{{docDesc}}} {{{docName}}}',
      },
    },
    personal: {
      shouldSendNotification({ diffs: { ownerId } }) {
        const { kind: changeKind } = ownerId || {};

        return (changeKind === ChangesKinds.FIELD_ADDED)
            || (changeKind === ChangesKinds.FIELD_CHANGED);
      },
      text: '{{{userName}}} assigned you to be an owner of {{{docDesc}}} {{{docName}}}',
      title: 'You have been assigned to be an owner of {{{docDesc}}}',
      sendBoth: true,
      emailTemplateData({ newDoc, auditConfig }) {
        return {
          button: {
            label: 'View document',
            url: auditConfig.docUrl(newDoc),
          },
        };
      },
      receivers({ diffs: { ownerId }, user }) {
        const userId = getUserId(user);
        const { newValue: newOwnerId } = ownerId || {};

        return (newOwnerId && (userId !== newOwnerId)) ? [newOwnerId] : [];
      },
    },
  },
  data({ diffs: { ownerId } }) {
    const { newValue, oldValue } = ownerId;

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
};
