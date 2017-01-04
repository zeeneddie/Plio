import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyOrgDate, getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceiversForIPReviewDate } from '../helpers';


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
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          'common.fields.improvementPlan.reviewDates.date.text.changed',
      },
    },
  ],
  data({ diffs, newDoc, user }) {
    const { newValue, oldValue } = diffs['improvementPlan.reviewDates.$.date'];
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
  receivers({ newDoc, user }) {
    return getReceiversForIPReviewDate({ newDoc, user });
  },
};
