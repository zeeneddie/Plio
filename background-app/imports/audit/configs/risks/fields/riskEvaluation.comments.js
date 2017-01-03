import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'riskEvaluation.comments',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'risks.fields.riskEvaluation.comments.added',
        [ChangesKinds.FIELD_CHANGED]:
          'risks.fields.riskEvaluation.comments.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'risks.fields.riskEvaluation.comments.removed',
      }
    }
  ],
  notifications: []
};
