import { ChangesKinds } from '../../../utils/changes-kinds.js';


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
            'Root cause analysis completed{{#if comments}}: {{comments}}{{/if}}' +
          '{{else}}' +
            'Root cause analysis canceled' +
          '{{/if}}'
      }
    }
  ],
  notifications: [],
  data({ diffs }) {
    const { newValue:status } = diffs['analysis.status'];
    const { newValue:comments } = diffs['analysis.completionComments'] || {};

    return {
      completed: () => status === 1, // Completed
      comments: () => comments
    };
  }
};
