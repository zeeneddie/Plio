import { ChangesKinds } from '../../../utils/changes-kinds';
import MilestoneWorkflow from '../../../../workflow/MilestoneWorkflow';
import { getReceivers } from '../helpers';

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
            'Milestone completed{{#if comments}}: {{{comments}}}{{/if}}' +
          '{{else}}' +
            'Milestone completion canceled' +
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
      new MilestoneWorkflow(newDoc._id).refreshStatus();
    }
  },
};
