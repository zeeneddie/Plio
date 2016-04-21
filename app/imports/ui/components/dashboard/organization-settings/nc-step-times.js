import { setStepTime } from '/imports/api/organizations/methods.js';


Template.Organizations_NcStepTimes.viewmodel({
  onChange() {
    return (timePickerVm) => {
      const timePickerContext = timePickerVm.templateInstance.data;
      const ncType = timePickerContext.ncType;

      const timeValue = Number(timePickerVm.timeValue());
      const timeUnit = timePickerVm.timeUnit();

      const _id = this.organizationId();

      setStepTime.call({ _id, ncType, timeValue, timeUnit }, (err) => {
        if (err) {
          console.log(err);
          toastr.error('Failed to update an organization');
        }
      });
    };
  }
});
