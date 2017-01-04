import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyOrgDate } from '../../../utils/helpers';


export default {
  field: 'improvementPlan.reviewDates.$.date',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_CHANGED]:
          'common.fields.improvementPlan.reviewDates.date.changed',
      },
    },
  ],
  notifications: [],
  data({ diffs, newDoc }) {
    const { newValue, oldValue } = diffs['improvementPlan.reviewDates.$.date'];
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      newValue: () => getPrettyOrgDate(newValue, orgId()),
      oldValue: () => getPrettyOrgDate(oldValue, orgId()),
    };
  },
};
