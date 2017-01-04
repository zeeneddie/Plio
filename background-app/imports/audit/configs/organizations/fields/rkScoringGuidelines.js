import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


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
      },
    },
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
      },
    },
  ],
  data({ newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
    };
  },
  receivers: getReceivers,
};
