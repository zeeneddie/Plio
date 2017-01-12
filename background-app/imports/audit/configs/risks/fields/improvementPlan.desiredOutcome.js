import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../../problems/helpers';


export default {
  field: 'improvementPlan.desiredOutcome',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Treatment plan statement of desired outcome set',
        [ChangesKinds.FIELD_CHANGED]:
          'Treatment plan statement of desired outcome changed',
        [ChangesKinds.FIELD_REMOVED]:
          'Treatment plan statement of desired outcome removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set treatment plan\'s statement of desired outcome of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed treatment plan\'s statement of desired outcome of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed treatment plan\'s statement of desired outcome of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data() { },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
