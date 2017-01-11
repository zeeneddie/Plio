import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../../problems/helpers';


export default {
  field: 'riskEvaluation.comments',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Risk evaluation comments set',
        [ChangesKinds.FIELD_CHANGED]: 'Risk evaluation comments changed',
        [ChangesKinds.FIELD_REMOVED]: 'Risk evaluation comments removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set evaluation comments of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed evaluation comments of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed evaluation comments of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data() { },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
