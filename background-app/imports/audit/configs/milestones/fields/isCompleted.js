import { ChangesKinds } from '../../../utils/changes-kinds';
import MilestoneWorkflow from '../../../../workflow/MilestoneWorkflow';

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
  notifications: [],
  data({ diffs: { isCompleted, completionComments } }) {
    return {
      completed: isCompleted.newValue,
      comments: completionComments && completionComments.newValue,
    };
  },
  trigger({ diffs, newDoc }) {
    if (diffs.completedAt && diffs.completedBy) {
      new MilestoneWorkflow(newDoc._id).refreshStatus();
    }
  },
};
