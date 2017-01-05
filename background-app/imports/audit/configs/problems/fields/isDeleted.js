import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'isDeleted',
  logs: [
    {
      shouldCreateLog({ diffs: { deletedAt, deletedBy } }) {
        return deletedAt && deletedBy;
      },
      message: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if deleted}}Document was deleted{{else}}Document was restored{{/if}}'
      }
    }
  ],
  notifications: [],
  data({ diffs: { isDeleted } }) {
    return {
      deleted: () => isDeleted.newValue
    };
  },
  triggers: [
    function({ newDoc: { _id } }) {
      new this.workflowConstructor(_id).refreshStatus();
    }
  ]
};
