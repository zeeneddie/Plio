import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail, getUserId } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'improvementPlan.owner',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'common.fields.improvementPlan.owner.added',
        [ChangesKinds.FIELD_CHANGED]:
          'common.fields.improvementPlan.owner.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'common.fields.improvementPlan.owner.removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          'common.fields.improvementPlan.owner.text.added',
        [ChangesKinds.FIELD_CHANGED]:
          'common.fields.improvementPlan.owner.text.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'common.fields.improvementPlan.owner.text.removed',
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
  data({ diffs, newDoc, user }) {
    const { newValue, oldValue } = diffs['improvementPlan.owner'];
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
  receivers: getReceivers,
};
