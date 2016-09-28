import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';

export default {
  field: 'notes',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Notes set',
        [ChangesKinds.FIELD_CHANGED]: 'Notes changed',
        [ChangesKinds.FIELD_REMOVED]: 'Notes removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: '{{userName}} set notes of {{{docDesc}}}',
        [ChangesKinds.FIELD_CHANGED]: '{{userName}} changed notes of {{{docDesc}}}',
        [ChangesKinds.FIELD_REMOVED]: '{{userName}} removed notes of {{{docDesc}}}'
      }
    }
  ],
  data({ diffs: { notes }, newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user)
    };
  },
  receivers: getReceivers
};
