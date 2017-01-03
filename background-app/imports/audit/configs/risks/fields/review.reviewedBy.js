import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';


export default {
  field: 'review.reviewedBy',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'risks.fields.review.reviewedBy.added',
        [ChangesKinds.FIELD_CHANGED]: 'risks.fields.review.reviewedBy.changed',
        [ChangesKinds.FIELD_REMOVED]: 'risks.fields.review.reviewedBy.removed',
      }
    }
  ],
  notifications: [],
  data({ diffs, newDoc }) {
    const { newValue, oldValue } = diffs['review.reviewedBy'];

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue)
    };
  }
};
