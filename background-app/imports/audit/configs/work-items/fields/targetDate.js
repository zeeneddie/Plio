import WorkItemWorkflow from '/imports/workflow/WorkItemWorkflow';


export default {
  field: 'targetDate',
  logs: [],
  notifications: [],
  trigger({ newDoc: { _id } }) {
    new WorkItemWorkflow(_id).refreshStatus();
  },
};
