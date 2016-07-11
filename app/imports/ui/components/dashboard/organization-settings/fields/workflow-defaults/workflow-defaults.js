import { Template } from 'meteor/templating';

import { setWorkflowDefaults } from '/imports/api/organizations/methods.js';


Template.OrgSettings_WorkflowDefaults.viewmodel({
  mixin: ['collapse', 'modal'],
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onChange(viewModel) {
    const type = viewModel.templateInstance.data.type;
    const { timeValue, timeUnit } = viewModel.getData();
    const _id = this.organizationId();

    this.modal().callMethod(setWorkflowDefaults, {
      _id, type, timeValue, timeUnit
    });
  }
});
