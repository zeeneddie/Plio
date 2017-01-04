import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'riskEvaluation.prevLossExp',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'risks.fields.riskEvaluation.prevLossExp.added',
        [ChangesKinds.FIELD_CHANGED]:
          'risks.fields.riskEvaluation.prevLossExp.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'risks.fields.riskEvaluation.prevLossExp.removed',
      },
    },
  ],
  notifications: [],
};
