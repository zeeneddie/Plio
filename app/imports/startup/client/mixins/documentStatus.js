import actionStatus from '/imports/startup/client/mixins/actionStatus.js';
import problemsStatus from '/imports/startup/client/mixins/problemsStatus.js';
import workItemStatus from '/imports/startup/client/mixins/workItemStatus.js';
import { ProblemTypes, ActionTypes } from '/imports/share/constants.js';

export default {
  getClassByStatusAndType(status, type) {
    if (type === ActionTypes.CORRECTIVE_ACTION || type === ActionTypes.PREVENTATIVE_ACTION || type === ActionTypes.RISK_CONTROL) {
      return actionStatus.getClassByStatus('status');
    } else if (type === ProblemTypes.RISK || type === ProblemTypes.NON_CONFORMITY) {
      return problemsStatus.getClassByStatus('status');
    }
    return 'default';
  },
};
