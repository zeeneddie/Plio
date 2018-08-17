import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';
import ActionWorkflow from '/imports/workflow/ActionWorkflow';


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
            'Action completed{{#if comments}}: {{{comments}}}{{/if}}' +
          '{{else}}' +
            'Action completion canceled' +
          '{{/if}}',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { completedAt, completedBy } }) {
        return completedAt && completedBy;
      },
      sendBoth: true,
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if completed}}' +
            '{{{userName}}} completed {{{docDesc}}} {{{docName}}}' +
            '{{#if comments}} with following comments: {{{comments}}}{{/if}}' +
          '{{else}}' +
            '{{{userName}}} canceled completion of {{{docDesc}}} {{{docName}}}' +
          '{{/if}}',
      },
    },
  ],
  data({ diffs: { isCompleted, completionComments } }) {
    return {
      completed: isCompleted.newValue,
      comments: completionComments && completionComments.newValue,
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
  trigger({ diffs, newDoc }) {
    if (diffs.completedAt && diffs.completedBy) {
      new ActionWorkflow(newDoc._id).refreshStatus();
    }
  },
};
