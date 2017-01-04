import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyOrgDate, getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'improvementPlan.targetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'common.fields.improvementPlan.targetDate.added',
        [ChangesKinds.FIELD_CHANGED]:
          'common.fields.improvementPlan.targetDate.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'common.fields.improvementPlan.targetDate.removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          'common.fields.improvementPlan.targetDate.text.added',
        [ChangesKinds.FIELD_CHANGED]:
          'common.fields.improvementPlan.targetDate.text.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'common.fields.improvementPlan.targetDate.text.removed',
      },
    },
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
      oldValue: () => getPrettyOrgDate(oldValue, orgId()),
    };
  },
  receivers: getReceivers,
};
