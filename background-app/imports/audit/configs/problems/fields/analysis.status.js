import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'analysis.status',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return diffs['analysis.completedAt'] && diffs['analysis.completedBy'];
      },
      message: {
        [ChangesKinds.FIELD_CHANGED]: 'problems.fields.analysis.status.changed',
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
  },
  triggers: [
    function({ diffs, newDoc: { _id } }) {
      if (diffs['analysis.completedAt'] && diffs['analysis.completedBy']) {
        new this.workflowConstructor(_id).refreshStatus();
      }
    }
  ]
};
