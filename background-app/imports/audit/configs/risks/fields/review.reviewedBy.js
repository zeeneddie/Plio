import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '/imports/share/helpers';
import { getReceivers } from '../../problems/helpers';


export default {
  field: 'review.reviewedBy',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Review assigned to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Review reassigned to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Review executor removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} assigned {{{newValue}}} to review {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} assigned {{{newValue}}} to review {{{docDesc}}} {{{docName}}} instead of {{{oldValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed review executor of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['review.reviewedBy'];

    return {
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
