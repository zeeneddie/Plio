import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'title',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Title set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Title changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Title removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set title of {{{docDesc}}} {{{docName}}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed title of {{{docDesc}}} {{{docName}}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed title of {{{docDesc}}} {{{docName}}}'
      }
    }
  ],
  data({ diffs: { title }, newDoc, oldDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(oldDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => title.newValue,
      oldValue: () => title.oldValue
    };
  },
  receivers: getReceivers
};
