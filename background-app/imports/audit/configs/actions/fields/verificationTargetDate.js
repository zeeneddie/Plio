import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail, getPrettyOrgDate } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';
import ActionWorkflow from '/imports/workflow/ActionWorkflow.js';


export default {
  field: 'verificationTargetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Verification target date set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Verification target date changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Verification target date removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set verification target date of {{{docDesc}}} {{{docName}}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed verification target date of {{{docDesc}}} {{{docName}}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed verification target date of {{{docDesc}}} {{{docName}}}'
      }
    }
  ],
  data({ diffs: { verificationTargetDate }, newDoc, user }) {
    const { newValue, oldValue } = verificationTargetDate;
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
