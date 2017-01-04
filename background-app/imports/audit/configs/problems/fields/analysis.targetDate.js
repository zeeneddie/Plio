import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyOrgDate } from '../../../utils/helpers';


export default {
  field: 'analysis.targetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'problems.fields.analysis.targetDate.added',
        [ChangesKinds.FIELD_CHANGED]: 'problems.fields.analysis.targetDate.changed',
        [ChangesKinds.FIELD_REMOVED]: 'problems.fields.analysis.targetDate.removed',
      },
    },
  ],
  notifications: [],
  data({ diffs, newDoc }) {
    const { newValue, oldValue } = diffs['analysis.targetDate'];
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      newValue: () => getPrettyOrgDate(newValue, orgId()),
      oldValue: () => getPrettyOrgDate(oldValue, orgId()),
    };
  },
  triggers: [
    function ({ newDoc: { _id } }) {
      new this.workflowConstructor(_id).refreshStatus();
    },
  ],
};
