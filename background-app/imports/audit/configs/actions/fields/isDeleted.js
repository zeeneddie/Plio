import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';
import ActionWorkflow from '/imports/workflow/ActionWorkflow.js';


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
  notifications: [
    {
      shouldSendNotification({ diffs: { deletedAt, deletedBy } }) {
        return deletedAt && deletedBy;
      },
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} {{#if deleted}}deleted{{else}}restored{{/if}} {{{docDesc}}} {{{docName}}}'
      },
      title: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} {{#if deleted}}deleted{{else}}restored{{/if}} {{{docDesc}}} {{{docName}}}'
      }
    }
  ],
  data({ diffs: { isDeleted }, newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      deleted: () => isDeleted.newValue
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
  triggers: [
    function({ newDoc: { _id } }) {
      new ActionWorkflow(_id).refreshStatus();
    }
  ]
};
