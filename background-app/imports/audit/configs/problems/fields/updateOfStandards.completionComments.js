import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'updateOfStandards.completionComments',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['updateOfStandards.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'problems.fields.updateOfStandards.completionComments.added',
        [ChangesKinds.FIELD_CHANGED]:
          'problems.fields.updateOfStandards.completionComments.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'problems.fields.updateOfStandards.completionComments.removed',
      }
    }
  ],
  notifications: []
};
