import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'improvementPlan.desiredOutcome',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'risks.fields.improvementPlan.desiredOutcome.added',
        [ChangesKinds.FIELD_CHANGED]:
          'risks.fields.improvementPlan.desiredOutcome.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'risks.fields.improvementPlan.desiredOutcome.removed',
      }
    }
  ],
  notifications: [],
  data() { }
};
