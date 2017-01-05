import { RiskEvaluationDecisions } from '/imports/share/constants';
import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'riskEvaluation.decision',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Risk evaluation treatment decision set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Risk evaluation treatment decision changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Risk evaluation treatment decision removed',
      },
    },
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['riskEvaluation.decision'];

    return {
      newValue: RiskEvaluationDecisions[newValue],
      oldValue: RiskEvaluationDecisions[oldValue],
    };
  },
};
