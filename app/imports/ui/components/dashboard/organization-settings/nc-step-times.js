import { setStepTime } from '/imports/api/organizations/methods.js';


Template.Organizations_NcStepTimes.viewmodel({
  onChange() {
    return (timePickerVm) => {
      const ncType = timePickerVm.templateInstance.data.ncType;

      const { timeValue, timeUnit } = timePickerVm.getData();

      const _id = this.organizationId();

      setStepTime.call({ _id, ncType, timeValue, timeUnit }, (err) => {
        if (err) {
          toastr.error('Failed to update an organization');
        }
      });
    };
  }
});
