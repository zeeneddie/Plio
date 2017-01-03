import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getPrettyOrgDate } from '../../../utils/helpers.js';


export default {
  field: 'improvementPlan.reviewDates',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]:
          'risks.fields.improvementPlan.reviewDates.item-added',
        [ChangesKinds.ITEM_REMOVED]:
          'risks.fields.improvementPlan.reviewDates.item-removed',
      }
    }
  ],
  notifications: [],
  data({ diffs, newDoc }) {
    const { item: { date } } = diffs['improvementPlan.reviewDates'];
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      date: () => getPrettyOrgDate(date, orgId())
    };
  }
};
