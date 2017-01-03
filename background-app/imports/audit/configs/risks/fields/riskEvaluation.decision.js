import { RiskEvaluationDecisions } from '/imports/share/constants.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'riskEvaluation.decision',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'risks.fields.riskEvaluation.decision.added',
        [ChangesKinds.FIELD_CHANGED]:
          'risks.fields.riskEvaluation.decision.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'risks.fields.riskEvaluation.decision.removed',
      }
    }
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['riskEvaluation.decision'];

    return {
      newValue: () => RiskEvaluationDecisions[newValue],
      oldValue: () => RiskEvaluationDecisions[oldValue]
    };
  }
};
