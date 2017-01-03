import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'analysis.completionComments',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['analysis.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'problems.fields.analysis.completionComments.added',
        [ChangesKinds.FIELD_CHANGED]:
          'problems.fields.analysis.completionComments.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'problems.fields.analysis.completionComments.removed',
      }
    }
  ],
  notifications: []
};
