import { setGuideline } from '/imports/api/organizations/methods.js';


Template.Organizations_NcGuidelines.viewmodel({
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onChange(viewModel) {
    const ncType = viewModel.templateInstance.data.ncType;
    const { text } = viewModel.getData();
    const _id = this.organizationId();

    this.setSavingState(true);

    setGuideline.call({ _id, ncType, text }, (err) => {
      this.setSavingState(false);

      if (err) {
        toastr.error('Failed to update a non-conformity guideline');
      }
    });
  }
});
