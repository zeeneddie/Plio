import { setReminder } from '/imports/api/organizations/methods.js';


Template.OrganizationSettings_NcReminders.viewmodel({
  mixin: ['collapse', 'editableModalSection'],
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onChange(viewModel) {
    const context = viewModel.templateInstance.data;
    const ncType = context.ncType;
    const reminderType = context.reminderType;
    const { timeValue, timeUnit } = viewModel.getData();
    const _id = this.organizationId();

    this.callMethod(setReminder, {
      _id, ncType, reminderType, timeValue, timeUnit
    });
  }
});
