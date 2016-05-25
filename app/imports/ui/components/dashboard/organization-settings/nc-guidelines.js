import { setGuideline } from '/imports/api/organizations/methods.js';


Template.OrganizationSettings_NcGuidelines.viewmodel({
  mixin: ['collapse', 'modal'],
  minor: '',
  major: '',
  critical: '',
  autorun() {
    const guidelines = this.guidelines && this.guidelines();
    if (guidelines) {
      this.load(guidelines);
    }
  },
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
