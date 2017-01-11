import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserId } from '../../../utils/helpers';
import { getUserFullNameOrEmail } from '/imports/share/helpers';


export default {
  logs: {
    default: {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Improvement plan owner set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Improvement plan owner changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Improvement plan owner removed',
      },
    },
  },
  notifications: {
    default: {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set improvement plan\'s owner of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed improvement plan\'s owner of {{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed improvement plan\'s owner of {{{docDesc}}} {{{docName}}}',
      },
    },
    personal: {
      shouldSendNotification({ diffs }) {
        const { kind: changeKind } = diffs['improvementPlan.owner'] || {};

        return (changeKind === ChangesKinds.FIELD_ADDED)
            || (changeKind === ChangesKinds.FIELD_CHANGED);
      },
      text: '{{{userName}}} selected you as improvement plan owner for {{{docDesc}}} {{{docName}}}',
      title: 'You have been selected as improvement plan owner',
      sendBoth: true,
      emailTemplateData({ newDoc, auditConfig }) {
        return {
          button: {
            label: 'View standard',
            url: auditConfig.docUrl(newDoc),
          },
        };
      },
      receivers({ diffs, user }) {
        const userId = getUserId(user);
        const { newValue: newOwnerId } = diffs['improvementPlan.owner'] || {};

        return (newOwnerId && (userId !== newOwnerId)) ? [newOwnerId] : [];
      },
    },
  },
  data({ diffs }) {
    const { newValue, oldValue } = diffs['improvementPlan.owner'];

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
};
