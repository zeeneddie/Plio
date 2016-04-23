import { setReminder } from '/imports/api/organizations/methods.js';


Template.Organizations_NcReminders.viewmodel({
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onChange(viewModel) {
    const context = viewModel.templateInstance.data;
    const ncType = context.ncType;
    const reminderType = context.reminderType;
    const { timeValue, timeUnit } = viewModel.getData();
    const _id = this.organizationId();

    this.setSavingState(true);

    setReminder.call({
      _id, ncType, reminderType, timeValue, timeUnit
    }, (err) => {
      this.setSavingState(false);
      
      if (err) {
        toastr.error('Failed to update an organization');
      }
    });
  }
});
