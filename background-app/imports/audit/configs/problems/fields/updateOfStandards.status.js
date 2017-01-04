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
          'problems.fields.updateOfStandards.status.changed',
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
  triggers: [
    function ({ diffs, newDoc: { _id } }) {
      if (diffs['updateOfStandards.completedAt']
            && diffs['updateOfStandards.completedBy']) {
        new this.workflowConstructor(_id).refreshStatus();
      }
    },
  ],
};
