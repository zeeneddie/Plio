import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getPrettyOrgDate, getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceiversForIPReviewDate } from '../helpers';


export default {
  field: 'improvementPlan.reviewDates',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]:
          'standards.fields.improvementPlan.reviewDates.item-added',
        [ChangesKinds.ITEM_REMOVED]:
          'standards.fields.improvementPlan.reviewDates.item-removed',
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          'standards.fields.improvementPlan.reviewDates.item-added',
        [ChangesKinds.ITEM_REMOVED]:
          'standards.fields.improvementPlan.reviewDates.item-removed',
      }
    }
  ],
  data({ diffs, newDoc, user }) {
    const { item: { date } } = diffs['improvementPlan.reviewDates'];
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      date: () => getPrettyOrgDate(date, orgId())
    };
  },
  receivers({ newDoc, user }) {
    return getReceiversForIPReviewDate({ newDoc, user });
  }
};
