import { Template } from 'meteor/templating';

import { setWorkflowDefaults } from '/imports/api/organizations/methods.js';
import { OrganizationSettingsHelp } from '/imports/api/help-messages.js';

Template.OrgSettings_WorkflowDefaults.viewmodel({
  mixin: 'modal',
  _lText: 'Workflow steps',
  helpText: OrganizationSettingsHelp.workflowSteps,
  
  onWorkflowTypeChangeCb() {
    return this.onWorkflowTypeChange.bind(this);
  },
  onWorkflowTypeChange(viewModel) {
    const { selected:workflowType } = viewModel.getData();

    if (viewModel.templateInstance.data.selected === workflowType) {
      return;
    }

    const type = viewModel.templateInstance.data.type;
    const _id = this.organizationId();

    this.modal().callMethod(setWorkflowDefaults, {
      _id, type, workflowType
    });
  },
  onStepTimeChangeCb() {
    return this.onStepTimeChange.bind(this);
  },
  onStepTimeChange(viewModel) {
    const type = viewModel.templateInstance.data.type;
    const { timeValue, timeUnit } = viewModel.getData();
    const _id = this.organizationId();

    this.modal().callMethod(setWorkflowDefaults, {
      _id, type, stepTime: { timeValue, timeUnit }
    });
  }
});
