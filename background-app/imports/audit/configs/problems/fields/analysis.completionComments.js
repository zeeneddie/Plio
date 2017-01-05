import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'analysis.completionComments',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['analysis.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Root cause analysis completion comments set',
        [ChangesKinds.FIELD_CHANGED]: 'Root cause analysis completion comments changed',
        [ChangesKinds.FIELD_REMOVED]: 'Root cause analysis completion comments removed',
      },
    },
  ],
  notifications: [],
  data() { },
};
