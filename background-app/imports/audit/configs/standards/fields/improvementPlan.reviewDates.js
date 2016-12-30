import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getPrettyOrgDate, getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers';


export default {
  field: 'improvementPlan.reviewDates',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]:
          'Improvement plan review date added: "{{date}}"',
        [ChangesKinds.ITEM_REMOVED]:
          'Improvement plan review date removed: "{{date}}"'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{userName}} added improvement plan\'s review date for {{{docDesc}}} {{{docName}}}: "{{date}}"',
        [ChangesKinds.ITEM_REMOVED]:
          '{{userName}} removed improvement plan\'s review date for {{{docDesc}}} {{{docName}}}: "{{date}}"'
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
  receivers: getReceivers,
};
