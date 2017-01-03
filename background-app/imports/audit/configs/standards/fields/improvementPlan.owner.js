import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail, getUserId } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'improvementPlan.owner',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'standards.fields.improvementPlan.owner.added',
        [ChangesKinds.FIELD_CHANGED]:
          'standards.fields.improvementPlan.owner.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'standards.fields.improvementPlan.owner.removed',
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          'standards.fields.improvementPlan.owner.text.added',
        [ChangesKinds.FIELD_CHANGED]:
          'standards.fields.improvementPlan.owner.text.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'standards.fields.improvementPlan.owner.text.removed',
      }
    },
    {
      shouldSendNotification({ diffs }) {
        const { kind:changeKind } = diffs['improvementPlan.owner'] || {};

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
            url: this.docUrl(newDoc)
          }
        };
      },
      receivers({ diffs, user }) {
        const userId = getUserId(user);
        const { newValue:newOwnerId } = diffs['improvementPlan.owner'] || {};

        return (newOwnerId && (userId !== newOwnerId)) ? [newOwnerId] : [];
      }
    }
  ],
  data({ diffs, newDoc, user }) {
    const { newValue, oldValue } = diffs['improvementPlan.owner'];
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue)
    };
  },
  receivers: getReceivers
};
