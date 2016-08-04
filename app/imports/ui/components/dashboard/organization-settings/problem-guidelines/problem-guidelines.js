import { Template } from 'meteor/templating';

Template.OrgSettings_ProblemGuidelines.viewmodel({
  mixin: 'modal',
  minor: '',
  major: '',
  critical: '',
  label: '',
  method: '',
  guidelines: '',
  autorun() {
    this.load(this.guidelines());
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
