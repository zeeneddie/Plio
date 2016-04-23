import { setStepTime } from '/imports/api/organizations/methods.js';


Template.Organizations_NcStepTimes.viewmodel({
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onChange(viewModel) {
    const ncType = viewModel.templateInstance.data.ncType;
    const { timeValue, timeUnit } = viewModel.getData();
    const _id = this.organizationId();

    this.setSavingState(true);

    setStepTime.call({ _id, ncType, timeValue, timeUnit }, (err) => {
      this.setSavingState(false);

      if (err) {
        toastr.error('Failed to update workflow defaults');
      }
    });
  }
});
