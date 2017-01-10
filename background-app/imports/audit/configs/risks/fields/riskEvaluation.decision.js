import { RiskEvaluationDecisions } from '/imports/share/constants';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../../problems/helpers';


export default {
  field: 'riskEvaluation.decision',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Risk evaluation treatment decision set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Risk evaluation treatment decision changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Risk evaluation treatment decision removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set evaluation treatment decision of {{{docDesc}}} {{{docName}}} to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed evaluation treatment decision of {{{docDesc}}} {{{docName}}} from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed evaluation treatment decision of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['riskEvaluation.decision'];

    return {
      newValue: RiskEvaluationDecisions[newValue],
      oldValue: RiskEvaluationDecisions[oldValue],
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
