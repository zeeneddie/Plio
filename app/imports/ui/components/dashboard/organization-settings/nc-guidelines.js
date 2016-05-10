import { setGuideline } from '/imports/api/organizations/methods.js';


Template.OrganizationSettings_NcGuidelines.viewmodel({
  mixin: ['collapse', 'modal'],
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onChange(viewModel) {
    const ncType = viewModel.templateInstance.data.ncType;
    const { text } = viewModel.getData();
    const _id = this.organizationId();

    this.modal().callMethod(setGuideline, { _id, ncType, text });
  }
});
