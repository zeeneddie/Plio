import { OrgCurrencies } from '/imports/share/constants';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


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
          'Currency removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set currency of {{{docDesc}}} {{{docName}}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed currency of {{{docDesc}}} {{{docName}}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed currency of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { currency } }) {
    const { newValue, oldValue } = currency;

    return {
      newValue: OrgCurrencies[newValue],
      oldValue: OrgCurrencies[oldValue],
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
