import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'improvementPlan.desiredOutcome',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Treatment plan statement of desired outcome set',
        [ChangesKinds.FIELD_CHANGED]:
          'Treatment plan statement of desired outcome changed',
        [ChangesKinds.FIELD_REMOVED]:
          'Treatment plan statement of desired outcome removed',
      },
    },
  ],
  notifications: [],
  data() { },
};
