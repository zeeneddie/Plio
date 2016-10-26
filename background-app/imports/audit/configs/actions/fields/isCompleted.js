import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';
import ActionWorkflow from '/imports/workflow/ActionWorkflow.js';


export default {
  field: 'isCompleted',
  logs: [
    {
      shouldCreateLog({ diffs: { completedAt, completedBy } }) {
        return completedAt && completedBy;
      },
      message: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if completed}}' +
            'Action completed{{#if comments}}: {{comments}}{{/if}}' +
          '{{else}}' +
            'Action completion canceled' +
          '{{/if}}'
      }
    }
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { completedAt, completedBy } }) {
        return completedAt && completedBy;
      },
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if completed}}' +
            '{{userName}} completed {{{docDesc}}} {{{docName}}}' +
            '{{#if comments}} with following comments: {{comments}}{{/if}}' +
          '{{else}}' +
            '{{userName}} canceled completion of {{{docDesc}}} {{{docName}}}' +
          '{{/if}}'
      }
    }
  ],
  data({ diffs: { isCompleted, completionComments }, newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      completed: () => isCompleted.newValue,
      comments: () => completionComments && completionComments.newValue,
      userName: () => getUserFullNameOrEmail(user)
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
  triggers: [
    function({ diffs: { completedAt, completedBy }, newDoc: { _id } }) {
      if (completedAt && completedBy) {
        new ActionWorkflow(_id).refreshStatus();
      }
    }
  ]
};
