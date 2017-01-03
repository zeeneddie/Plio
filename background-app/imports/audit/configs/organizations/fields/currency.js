import { OrgCurrencies } from '/imports/share/constants.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'currency',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'organizations.fields.currency.added',
        [ChangesKinds.FIELD_CHANGED]: 'organizations.fields.currency.changed',
        [ChangesKinds.FIELD_REMOVED]: 'organizations.fields.currency.removed',
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'organizations.fields.currency.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'organizations.fields.currency.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'organizations.fields.currency.text.removed',
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
