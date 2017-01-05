import { ChangesKinds } from '../../../utils/changes-kinds.js';


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
  notifications: [],
  data() { }
};
