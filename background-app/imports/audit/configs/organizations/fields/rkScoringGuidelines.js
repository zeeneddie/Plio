import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'rkScoringGuidelines',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Risk scoring guidelines set',
        [ChangesKinds.FIELD_CHANGED]:
          'Risk scoring guidelines changed',
        [ChangesKinds.FIELD_REMOVED]:
          'Risk scoring guidelines removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set risk scoring guidelines in {{{docDesc}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed risk scoring guidelines in {{{docDesc}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed risk scoring guidelines in {{{docDesc}}}'
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
