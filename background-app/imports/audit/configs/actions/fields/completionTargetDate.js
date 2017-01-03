import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail, getPrettyOrgDate } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';
import ActionWorkflow from '/imports/workflow/ActionWorkflow.js';


export default {
  field: 'completionTargetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.completionTargetDate.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.completionTargetDate.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.completionTargetDate.removed',
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          'actions.fields.completionTargetDate.text.added',
        [ChangesKinds.FIELD_CHANGED]:
          'actions.fields.completionTargetDate.text.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'actions.fields.completionTargetDate.text.removed',
      }
    }
  ],
  data({ diffs: { completionTargetDate }, newDoc, user }) {
    const { newValue, oldValue } = completionTargetDate;
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getPrettyOrgDate(newValue, orgId()),
      oldValue: () => getPrettyOrgDate(oldValue, orgId())
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
  triggers: [
    function({ newDoc: { _id } }) {
      new ActionWorkflow(_id).refreshStatus();
    }
  ]
};
