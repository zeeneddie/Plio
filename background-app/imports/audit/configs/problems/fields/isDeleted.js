import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'isDeleted',
  logs: [
    {
      shouldCreateLog({ diffs: { deletedAt, deletedBy } }) {
        return deletedAt && deletedBy;
      },
      message: {
        [ChangesKinds.FIELD_CHANGED]: 'common.fields.isDeleted.changed',
      },
    },
  ],
  notifications: [],
  data({ diffs: { isDeleted } }) {
    return {
      deleted: () => isDeleted.newValue,
    };
  },
  triggers: [
    function ({ newDoc: { _id } }) {
      new this.workflowConstructor(_id).refreshStatus();
    },
  ],
};
