import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../../problems/helpers';
import IPTargetDate from '../../common/fields/improvementPlan.targetDate';


export default {
  field: 'improvementPlan.targetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Treatment plan target date for desired outcome set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Treatment plan target date for desired outcome changed from ' +
          '{{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Treatment plan target date for desired outcome removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set treatment plan\'s target date for desired outcome of ' +
          '{{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed treatment plan\'s target date for desired outcome of ' +
          '{{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed treatment plan\'s target date for desired outcome of ' +
          '{{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data: IPTargetDate.data,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
