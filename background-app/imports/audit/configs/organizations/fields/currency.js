import { OrgCurrencies } from '/imports/share/constants.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'currency',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Currency set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Currency changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Currency removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set currency of {{{docDesc}}} {{{docName}}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed currency of {{{docDesc}}} {{{docName}}} from "{{oldValue}}" to "{{newValue}}"'
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed currency of {{{docDesc}}} {{{docName}}}'
      }
    }
  ],
  data({ diffs: { currency }, newDoc, user }) {
    const { newValue, oldValue } = currency;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => OrgCurrencies[newValue],
      oldValue: () => OrgCurrencies[oldValue]
    };
  },
  receivers: getReceivers
};
