import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'rkScoringGuidelines',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'organizations.fields.rkScoringGuidelines.added',
        [ChangesKinds.FIELD_CHANGED]:
          'organizations.fields.rkScoringGuidelines.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'organizations.fields.rkScoringGuidelines.removed',
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          'organizations.fields.rkScoringGuidelines.text.added',
        [ChangesKinds.FIELD_CHANGED]:
          'organizations.fields.rkScoringGuidelines.text.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'organizations.fields.rkScoringGuidelines.text.removed',
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
