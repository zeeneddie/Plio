import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getPrettyOrgDate, getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'improvementPlan.targetDate',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Improvement plan target date for desired outcome set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Improvement plan target date for desired outcome changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Improvement plan target date for desired outcome removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set improvement plan\'s target date for desired outcome of {{{docDesc}}} {{{docName}}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed improvement plan\'s target date for desired outcome of {{{docDesc}}} {{{docName}}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed improvement plan\'s target date for desired outcome of {{{docDesc}}} {{{docName}}}'
      }
    }
  ],
  data({ diffs, newDoc, user }) {
    const { newValue, oldValue } = diffs['improvementPlan.targetDate'];
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
  receivers: getReceivers
};
