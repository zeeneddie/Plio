import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'improvementPlan.owner',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Improvement plan owner set to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Improvement plan owner changed from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Improvement plan owner removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set improvement plan\'s owner of {{{docDesc}}} {{{docName}}} to {{newValue}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed improvement plan\'s owner of {{{docDesc}}} {{{docName}}} from {{oldValue}} to {{newValue}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed improvement plan\'s owner of {{{docDesc}}} {{{docName}}}'
      }
    }
  ],
  data({ diffs, newDoc, user }) {
    const { newValue, oldValue } = diffs['improvementPlan.owner'];
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getUserFullNameOrEmail(newValue),
      oldValue: () => getUserFullNameOrEmail(oldValue)
    };
  },
  receivers: getReceivers
};
