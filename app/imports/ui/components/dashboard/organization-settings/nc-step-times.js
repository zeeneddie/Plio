import { setStepTime } from '/imports/api/organizations/methods.js';


Template.OrganizationSettings_NcStepTimes.viewmodel({
  mixin: ['collapse', 'editableModalSection'],
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onChange(viewModel) {
    const ncType = viewModel.templateInstance.data.ncType;
    const { timeValue, timeUnit } = viewModel.getData();
    const _id = this.organizationId();

    this.callMethod(setStepTime, {
      _id, ncType, timeValue, timeUnit
    });
  }
});
