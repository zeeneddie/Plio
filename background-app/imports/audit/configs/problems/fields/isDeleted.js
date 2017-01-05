import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'isDeleted',
  logs: [
    {
      shouldCreateLog({ diffs: { deletedAt, deletedBy } }) {
        return deletedAt && deletedBy;
      },
      message: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if deleted}}Document was deleted{{else}}Document was restored{{/if}}',
      },
    },
  ],
  notifications: [],
  data({ diffs: { isDeleted } }) {
    return { deleted: isDeleted.newValue };
  },
  trigger({ newDoc: { _id }, auditConfig }) {
    new auditConfig.workflowConstructor(_id).refreshStatus();
  },
};
