import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'issueNumber',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Issue number set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Issue number changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Issue number removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set issue number of {{{docDesc}}} {{{docName}}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed issue number of {{{docDesc}}} {{{docName}}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed issue number of {{{docDesc}}} {{{docName}}}'
      }
    }
  ],
  data({ diffs: { issueNumber }, newDoc, user }) {
    const { newValue, oldValue } = issueNumber;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => newValue,
      oldValue: () => oldValue
    };
  },
  receivers: getReceivers
};
