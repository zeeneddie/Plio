import { ChangesKinds } from '../../../utils/changes-kinds';


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
  notifications: [],
  data() { },
};
