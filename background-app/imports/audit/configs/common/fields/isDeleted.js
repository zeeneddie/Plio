import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  logs: {
    default: {
      shouldCreateLog({ diffs: { deletedAt, deletedBy } }) {
        return deletedAt && deletedBy;
      },
      message: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if deleted}}Document was deleted{{else}}Document was restored{{/if}}',
      },
    },
  },
  notifications: {
    default: {
      shouldSendNotification({ diffs: { deletedAt, deletedBy } }) {
        return deletedAt && deletedBy;
      },
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} {{#if deleted}}deleted{{else}}restored{{/if}} {{{docDesc}}} {{{docName}}}',
      },
      title: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} {{#if deleted}}deleted{{else}}restored{{/if}} {{{docDesc}}} {{{docName}}}',
      },
    },
  },
  data({ diffs: { isDeleted } }) {
    return {
      deleted: isDeleted.newValue,
    };
  },
};
