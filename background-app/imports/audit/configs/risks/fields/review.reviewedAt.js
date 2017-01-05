import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getPrettyOrgDate } from '../../../utils/helpers.js';


export default {
  field: 'review.reviewedAt',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Review date set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Review date changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Review date removed'
      }
    }
  ],
  notifications: [],
  data({ diffs, newDoc }) {
    const { newValue, oldValue } = diffs['review.reviewedAt'];
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      newValue: getPrettyOrgDate(newValue, orgId()),
      oldValue: getPrettyOrgDate(oldValue, orgId())
    };
  }
};
