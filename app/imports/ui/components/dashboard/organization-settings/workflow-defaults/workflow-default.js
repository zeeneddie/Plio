import { Template } from 'meteor/templating';

import { WorkflowTypes } from '/imports/api/constants.js';


Template.OrgSettings_WorkflowDefault.viewmodel({
  workflows() {
    return _.map(_.values(WorkflowTypes), (workflowId) => {
      return { _id: workflowId, title: workflowId };
    });
  },
  onWorkflowTypeChangeCb() {
    return this.onWorkflowTypeChange;
  },
  onStepTimeChangeCb() {
    return this.onStepTimeChange;
  }
});
