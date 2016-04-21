import { setGuideline } from '/imports/api/organizations/methods.js';


Template.Organizations_NcGuidelines.viewmodel({
  onChange() {
    return (ncGuidelineVm) => {
      const ncType = ncGuidelineVm.templateInstance.data.ncType;
      const { text } = ncGuidelineVm.getData();

      const _id = this.organizationId();

      setGuideline.call({ _id, ncType, text }, (err) => {
        if (err) {
          toastr.error('Failed to update an organization');
        }
      });
    };
  }
});
