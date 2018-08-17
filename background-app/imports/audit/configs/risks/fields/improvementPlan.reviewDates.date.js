import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../../problems/helpers';
import IPReviewDate from '../../common/fields/improvementPlan.reviewDates.date';


export default {
  field: 'improvementPlan.reviewDates.$.date',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_CHANGED]:
          'Treatment plan review date changed from {{{oldValue}}} to {{{newValue}}}',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed treatment plan\'s review date for ' +
          '{{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
      },
    },
  ],
  data: IPReviewDate.data,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
