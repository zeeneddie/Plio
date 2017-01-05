import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


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
  notifications: [
    {
      shouldSendNotification({ diffs: { deletedAt, deletedBy } }) {
        return deletedAt && deletedBy;
      },
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} {{#if deleted}}deleted{{else}}restored{{/if}} {{{docDesc}}} {{{docName}}}',
      },
      title: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} {{#if deleted}}deleted{{else}}restored{{/if}} {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { isDeleted } }) {
    return { deleted: isDeleted.newValue };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
