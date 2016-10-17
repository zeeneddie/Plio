import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail, getPrettyOrgDate } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';
import ActionWorkflow from '/imports/workflow/ActionWorkflow.js';


export default {
  field: 'completionTargetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Completion target date set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Completion target date changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Completion target date removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set completion target date of {{{docDesc}}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed completion target date of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed completion target date of {{{docDesc}}}'
      }
    }
  ],
  data({ diffs: { completionTargetDate }, newDoc, user }) {
    const { newValue, oldValue } = completionTargetDate;
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
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
