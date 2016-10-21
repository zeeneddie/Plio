import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'name',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Name set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Name changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Name removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set name of {{{docDesc}}} {{{docName}}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed name of {{{docDesc}}} {{{docName}}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed name of {{{docDesc}}} {{{docName}}}'
      }
    }
  ],
  data({ diffs: { name }, oldDoc, user }) {
    const { newValue, oldValue } = name;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(oldDoc),
      docName: () => auditConfig.docName(oldDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => newValue,
      oldValue: () => oldValue
    };
  },
  receivers: getReceivers
};
