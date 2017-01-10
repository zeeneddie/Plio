import { RiskEvaluationPriorities } from '/imports/share/constants';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../../problems/helpers';


export default {
  field: 'riskEvaluation.priority',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Risk evaluation treatment priority set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Risk evaluation treatment priority changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Risk evaluation treatment priority removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set evaluation treatment priority of {{{docDesc}}} {{{docName}}} to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed evaluation treatment priority of {{{docDesc}}} {{{docName}}} from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed evaluation treatment priority of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs }) {
    const { newValue, oldValue } = diffs['riskEvaluation.priority'];

    return {
      newValue: RiskEvaluationPriorities[newValue],
      oldValue: RiskEvaluationPriorities[oldValue],
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
