import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'timezone',
  logs: [],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed timezone of {{{docDesc}}} {{{docName}}} from "{{oldValue}}" to "{{newValue}}"'
      }
    }
  ],
  data({ diffs: { timezone }, newDoc, user }) {
    const { newValue, oldValue } = timezone;
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
