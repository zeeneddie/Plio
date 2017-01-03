import { RiskEvaluationPriorities } from '/imports/share/constants.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'riskEvaluation.priority',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'risks.fields.riskEvaluation.priority.added',
        [ChangesKinds.FIELD_CHANGED]:
          'risks.fields.riskEvaluation.priority.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'risks.fields.riskEvaluation.priority.removed',
      }
    }
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['riskEvaluation.priority'];

    return {
      newValue: () => RiskEvaluationPriorities[newValue],
      oldValue: () => RiskEvaluationPriorities[oldValue]
    };
  }
};
