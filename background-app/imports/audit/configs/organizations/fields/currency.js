import { OrgCurrencies } from '/imports/share/constants.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'currency',
  logs: [],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed currency of {{{docDesc}}} {{{docName}}} from "{{oldValue}}" to "{{newValue}}"'
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
