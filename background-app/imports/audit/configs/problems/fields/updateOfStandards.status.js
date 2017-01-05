import { ChangesKinds } from '../../../utils/changes-kinds';


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
  notifications: [],
  data({ diffs }) {
    const { newValue: status } = diffs['updateOfStandards.status'];
    const { newValue: comments } = diffs['updateOfStandards.completionComments'] || {};

    return {
      completed: status === 1, // Completed
      comments,
    };
  },
  trigger({ diffs, newDoc: { _id }, auditConfig }) {
    if (diffs['updateOfStandards.completedAt']
          && diffs['updateOfStandards.completedBy']) {
      new auditConfig.workflowConstructor(_id).refreshStatus();
    }
  },
};
