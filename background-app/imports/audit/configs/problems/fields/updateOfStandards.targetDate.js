import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getPrettyOrgDate } from '../../../utils/helpers.js';


export default {
  field: 'updateOfStandards.targetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'problems.fields.updateOfStandards.targetDate.added',
        [ChangesKinds.FIELD_CHANGED]:
          'problems.fields.updateOfStandards.targetDate.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'problems.fields.updateOfStandards.targetDate.removed',
      }
    }
  ],
  notifications: [],
  data({ diffs, newDoc }) {
    const { newValue, oldValue } = diffs['updateOfStandards.targetDate'];
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      newValue: () => getPrettyOrgDate(newValue, orgId()),
      oldValue: () => getPrettyOrgDate(oldValue, orgId())
    };
  },
  triggers: [
    function({ newDoc: { _id } }) {
      new this.workflowConstructor(_id).refreshStatus();
    }
  ]
};
