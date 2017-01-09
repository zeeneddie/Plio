import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'updateOfStandards.status',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return diffs['updateOfStandards.completedAt']
            && diffs['updateOfStandards.completedBy'];
      },
      message: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if completed}}' +
            'Update of standards completed{{#if comments}}: {{comments}}{{/if}}' +
          '{{else}}' +
            'Update of standards canceled' +
          '{{/if}}',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs }) {
        return diffs['updateOfStandards.completedAt']
            && diffs['updateOfStandards.completedBy'];
      },
      text: {
        [ChangesKinds.FIELD_CHANGED]:
          '{{#if completed}}' +
            '{{userName}} completed update of standards of {{{docDesc}}} {{{docName}}}' +
          '{{else}}' +
            '{{userName}} canceled update of standards of {{{docDesc}}} {{{docName}}}' +
          '{{/if}}',
      },
    },
  ],
  data({ diffs }) {
    const { newValue: status } = diffs['updateOfStandards.status'];
    const { newValue: comments } = diffs['updateOfStandards.completionComments'] || {};

    return {
      completed: status === 1, // Completed
      comments,
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
  trigger({ diffs, newDoc: { _id }, auditConfig }) {
    if (diffs['updateOfStandards.completedAt']
          && diffs['updateOfStandards.completedBy']) {
      new auditConfig.workflowConstructor(_id).refreshStatus();
    }
  },
};
