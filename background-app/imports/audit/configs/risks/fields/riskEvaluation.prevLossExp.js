import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../../problems/helpers';


export default {
  field: 'riskEvaluation.prevLossExp',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Risk evaluation previous loss experience set',
        [ChangesKinds.FIELD_CHANGED]:
          'Risk evaluation previous loss experience changed',
        [ChangesKinds.FIELD_REMOVED]:
          'Risk evaluation previous loss experience removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set evaluation previous loss experience of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed evaluation previous loss experience of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed evaluation previous loss experience of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data() { },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
