import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getPrettyOrgDate } from '../../../utils/helpers.js';


export default {
  field: 'improvementPlan.reviewDates',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'Treatment plan review date added: "{{date}}"',
        [ChangesKinds.ITEM_REMOVED]: 'Treatment plan review date removed: "{{date}}"'
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
