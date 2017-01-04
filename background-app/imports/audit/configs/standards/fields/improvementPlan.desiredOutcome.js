import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'improvementPlan.desiredOutcome',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'common.fields.improvementPlan.desiredOutcome.added',
        [ChangesKinds.FIELD_CHANGED]:
          'common.fields.improvementPlan.desiredOutcome.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'common.fields.improvementPlan.desiredOutcome.removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          'common.fields.improvementPlan.desiredOutcome.text.added',
        [ChangesKinds.FIELD_CHANGED]:
          'common.fields.improvementPlan.desiredOutcome.text.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'common.fields.improvementPlan.desiredOutcome.text.removed',
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
