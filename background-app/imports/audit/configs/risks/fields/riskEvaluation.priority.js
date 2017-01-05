import { RiskEvaluationPriorities } from '/imports/share/constants.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'riskEvaluation.priority',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Risk evaluation treatment priority set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Risk evaluation treatment priority changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Risk evaluation treatment priority removed'
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
