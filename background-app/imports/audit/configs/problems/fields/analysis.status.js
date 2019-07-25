import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'analysis.status',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return diffs['analysis.completedAt'] && diffs['analysis.completedBy'];
      },
      message: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if completed}}' +
            'Root cause analysis completed{{#if comments}}: {{{comments}}}{{/if}}' +
          '{{else}}' +
            'Root cause analysis canceled' +
          '{{/if}}',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs }) {
        return diffs['analysis.completedAt'] && diffs['analysis.completedBy'];
      },
      sendBoth: true,
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if completed}}' +
            '{{{userName}}} completed root cause analysis of {{{docDesc}}} {{{docName}}}.' +
            'Now add corrective or preventative actions in order to manage this nonconformity.' +
          '{{else}}' +
            '{{{userName}}} canceled root cause analysis of {{{docDesc}}} {{{docName}}}' +
          '{{/if}}',
      },
    },
  ],
  data({ diffs }) {
    const { newValue: status } = diffs['analysis.status'];
    const { newValue: comments } = diffs['analysis.completionComments'] || {};

    return {
      completed: status === 1, // Completed
      comments,
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
  trigger({ diffs, newDoc: { _id }, auditConfig }) {
    if (diffs['analysis.completedAt'] && diffs['analysis.completedBy']) {
      new auditConfig.workflowConstructor(_id).refreshStatus();
    }
  },
};
