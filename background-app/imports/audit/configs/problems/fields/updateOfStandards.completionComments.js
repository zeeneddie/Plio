import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'updateOfStandards.completionComments',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['updateOfStandards.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Update of standards completion comments set',
        [ChangesKinds.FIELD_CHANGED]: 'Update of standards completion comments changed',
        [ChangesKinds.FIELD_REMOVED]: 'Update of standards completion comments removed',
      },
    },
  ],
  notifications: [],
  data() { },
};
