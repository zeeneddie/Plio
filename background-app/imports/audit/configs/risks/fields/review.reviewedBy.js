import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '/imports/share/helpers';
import { getReceivers } from '../../problems/helpers';


export default {
  field: 'review.reviewedBy',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Review executor set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Review executor changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Review executor removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set review executor of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed review executor of {{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
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
