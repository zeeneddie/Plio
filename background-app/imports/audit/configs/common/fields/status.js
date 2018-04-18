import { ChangesKinds } from '../../../utils/changes-kinds';

export default {
  field: 'status',
  logs: {
    default: {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Status set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]: 'Status changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]: 'Status removed',
      },
    },
  },
};
