import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'rkScoringGuidelines',
  logs: [],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed risk scoring guidelines in {{{docDesc}}} {{{docName}}}'
      }
    }
  ],
  data({ newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user)
    };
  },
  receivers: getReceivers
};
