import { Template } from 'meteor/templating';
import { OrganizationSettingsHelp } from '/imports/api/help-messages.js';

Template.OrgSettings_ProblemGuidelines.viewmodel({
  mixin: 'modal',
  minor: '',
  major: '',
  critical: '',
  label: '',
  method: '',
  guidelines: '',
  helpText: OrganizationSettingsHelp.nonConformityGuidelines,
  autorun() {
    this.load(this.guidelines());
  },
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onChange(viewModel) {
    const type = viewModel.templateInstance.data.magnitude;
    const { text } = viewModel.getData();
    const _id = this.organizationId();

    this.modal().callMethod(this.method(), { _id, type, text });
  },
});
