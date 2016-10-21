import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';


export default {
  field: 'review.reviewedBy',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Review executor set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Review executor changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Review executor removed'
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
