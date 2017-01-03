import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'improvementPlan.desiredOutcome',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'non-conformities.fields.improvementPlan.desiredOutcome.added',
        [ChangesKinds.FIELD_CHANGED]:
          'non-conformities.fields.improvementPlan.desiredOutcome.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'non-conformities.fields.improvementPlan.desiredOutcome.removed',
      }
    }
  ],
  notifications: [],
  data() { }
};
