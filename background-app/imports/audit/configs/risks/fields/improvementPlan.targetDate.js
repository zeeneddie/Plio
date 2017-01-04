import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyOrgDate } from '../../../utils/helpers';


export default {
  field: 'improvementPlan.targetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'risks.fields.improvementPlan.targetDate.added',
        [ChangesKinds.FIELD_CHANGED]:
          'risks.fields.improvementPlan.targetDate.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'risks.fields.improvementPlan.targetDate.removed',
      },
    },
  ],
  notifications: [],
  data({ diffs, newDoc }) {
    const { newValue, oldValue } = diffs['improvementPlan.targetDate'];
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      newValue: () => getPrettyOrgDate(newValue, orgId()),
      oldValue: () => getPrettyOrgDate(oldValue, orgId()),
    };
  },
};
