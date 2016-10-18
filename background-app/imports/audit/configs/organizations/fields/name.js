import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'name',
  logs: [],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed name of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"'
      }
    }
  ],
  data({ diffs: { name }, oldDoc, user }) {
    const { newValue, oldValue } = name;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(oldDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => newValue,
      oldValue: () => oldValue
    };
  },
  receivers: getReceivers
};
