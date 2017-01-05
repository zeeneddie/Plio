import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail, getUserId } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'improvementPlan.owner',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Improvement plan owner set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Improvement plan owner changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Improvement plan owner removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set improvement plan\'s owner of {{{docDesc}}} {{{docName}}} to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed improvement plan\'s owner of {{{docDesc}}} {{{docName}}} from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed improvement plan\'s owner of {{{docDesc}}} {{{docName}}}',
      },
    },
    {
      shouldSendNotification({ diffs }) {
        const { kind: changeKind } = diffs['improvementPlan.owner'] || {};

        return (changeKind === ChangesKinds.FIELD_ADDED)
            || (changeKind === ChangesKinds.FIELD_CHANGED);
      },
      text: '{{{userName}}} selected you as improvement plan owner for {{{docDesc}}} {{{docName}}}',
      title: 'You have been selected as improvement plan owner',
      sendBoth: true,
      emailTemplateData({ newDoc }) {
        return {
          button: {
            label: 'View standard',
            url: this.docUrl(newDoc),
          },
        };
      },
      receivers({ diffs, user }) {
        const userId = getUserId(user);
        const { newValue: newOwnerId } = diffs['improvementPlan.owner'] || {};

        return (newOwnerId && (userId !== newOwnerId)) ? [newOwnerId] : [];
      },
    },
  ],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['improvementPlan.owner'];

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
