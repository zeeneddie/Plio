import { ChangesKinds } from '../../../utils/changes-kinds';


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
  notifications: [],
  data() { },
};
