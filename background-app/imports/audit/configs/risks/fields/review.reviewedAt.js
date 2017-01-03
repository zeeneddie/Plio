import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getPrettyOrgDate } from '../../../utils/helpers.js';


export default {
  field: 'review.reviewedAt',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'risks.fields.review.reviewedAt.added',
        [ChangesKinds.FIELD_CHANGED]: 'risks.fields.review.reviewedAt.changed',
        [ChangesKinds.FIELD_REMOVED]: 'risks.fields.review.reviewedAt.removed',
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
