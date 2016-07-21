Template.OrganizationSettings_ProblemGuidelines.viewmodel({
  mixin: ['collapse', 'modal'],
  minor: '',
  major: '',
  critical: '',
  label: '',
  method: '',
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
    const type = viewModel.templateInstance.data.type;
    const { text } = viewModel.getData();
    const _id = this.organizationId();

    this.modal().callMethod(this.method(), { _id, type, text });
  }
});
