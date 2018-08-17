import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../../problems/helpers';
import IPReviewDates from '../../common/fields/improvementPlan.reviewDates';


export default {
  field: 'improvementPlan.reviewDates',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'Treatment plan review date added: {{{date}}}',
        [ChangesKinds.ITEM_REMOVED]: 'Treatment plan review date removed: {{{date}}}',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{{userName}}} added treatment plan\'s review date for ' +
          '{{{docDesc}}} {{{docName}}}: {{{date}}}',
        [ChangesKinds.ITEM_REMOVED]:
          '{{{userName}}} removed treatment plan\'s review date for ' +
          '{{{docDesc}}} {{{docName}}}: {{{date}}}',
      },
    },
  ],
  data: IPReviewDates.data,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
