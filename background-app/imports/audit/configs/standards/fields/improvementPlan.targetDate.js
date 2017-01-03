import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getPrettyOrgDate, getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'improvementPlan.targetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'standards.fields.improvementPlan.targetDate.added',
        [ChangesKinds.FIELD_CHANGED]:
          'standards.fields.improvementPlan.targetDate.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'standards.fields.improvementPlan.targetDate.removed',
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          'standards.fields.improvementPlan.targetDate.text.added',
        [ChangesKinds.FIELD_CHANGED]:
          'standards.fields.improvementPlan.targetDate.text.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'standards.fields.improvementPlan.targetDate.text.removed',
      }
    }
  ],
  data({ diffs, newDoc, user }) {
    const { newValue, oldValue } = diffs['improvementPlan.targetDate'];
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getPrettyOrgDate(newValue, orgId()),
      oldValue: () => getPrettyOrgDate(oldValue, orgId())
    };
  },
  receivers: getReceivers
};
