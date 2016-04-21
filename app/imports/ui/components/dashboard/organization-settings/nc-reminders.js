import { setReminder } from '/imports/api/organizations/methods.js';


Template.Organizations_NcReminders.viewmodel({
  onChange() {
    return (timePickerVm) => {
      const timePickerContext = timePickerVm.templateInstance.data;
      const ncType = timePickerContext.ncType;
      const reminderType = timePickerContext.reminderType;

      const { timeValue, timeUnit } = timePickerVm.getData();

      const _id = this.organizationId();

      setReminder.call({
        _id, ncType, reminderType, timeValue, timeUnit
      }, (err) => {
        if (err) {
          toastr.error('Failed to update an organization');
        }
      });
    };
  }
});
