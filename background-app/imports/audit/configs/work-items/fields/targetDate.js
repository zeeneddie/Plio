import WorkItemWorkflow from '/imports/workflow/WorkItemWorkflow';


export default {
  field: 'targetDate',
  logs: [],
  notifications: [],
  triggers: [
    function ({ newDoc: { _id } }) {
      new WorkItemWorkflow(_id).refreshStatus();
    },
  ],
};
