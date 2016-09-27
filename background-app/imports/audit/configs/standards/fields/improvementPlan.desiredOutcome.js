import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'improvementPlan.desiredOutcome',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Improvement plan statement of desired outcome set',
        [ChangesKinds.FIELD_CHANGED]:
          'Improvement plan statement of desired outcome changed',
        [ChangesKinds.FIELD_REMOVED]:
          'Improvement plan statement of desired outcome removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set improvement plan\'s statement of desired outcome of {{{docDesc}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed improvement plan\'s statement of desired outcome of {{{docDesc}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed improvement plan\'s statement of desired outcome of {{{docDesc}}}'
      }
    }
  ],
  data({ newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user)
    };
  },
  receivers: getReceivers
};
