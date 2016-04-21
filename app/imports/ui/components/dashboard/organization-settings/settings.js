import { Organizations } from '/imports/api/organizations/organizations.js';
import { Departments } from '/imports/api/departments/departments.js';
import { StandardTypes } from '/imports/api/standard-types/standard-types.js';
import { update } from '/imports/api/organizations/methods.js'


Template.Organizations_Settings.viewmodel({
  isSaving(val) {
    const modalHeading = this.child('ModalHeading');

    if (val !== undefined) {
      modalHeading.isSaving(val);
    }

    return modalHeading.isSaving();
  },
  organization() {
    // temporary!
    return Organizations.findOne();
  },
  organizationId() {
    return this.organization()._id;
  },
  departments() {
    const organizationId = this.organization()._id;
    return Departments.find({ organizationId });
  },
  standardTypes() {
    const organizationId = this.organization()._id;
    return StandardTypes.find({ organizationId });
  },
  name() {
    return this.organization().name;
  },
  currency() {
    return this.organization().currency;
  },
  stepTimes() {
    return this.organization().ncStepTimes;
  },
  reminders() {
    return this.organization().ncReminders;
  },
  guidelines() {
    return this.organization().ncGuidelines;
  },
  onClose() {
    return () => {
      const { name, currency } = this.child('Organizations_MainSettings').getData();
      const ncStepTimes = this.child('Organizations_NcStepTimes').getData();
      const ncReminders = this.child('Organizations_NcReminders').getData();
      const ncGuidelines = this.child('Organizations_NcGuidelines').getData();

      const { _id } = this.organization();

      this.isSaving(true);

      update.call({
        _id, name, currency, ncStepTimes,
        ncReminders, ncGuidelines
      }, (err, res) => {
        if (err) {
          toastr.error(err);
        } else {
          toastr.success('Organization has been updated');
        }

        this.isSaving(false);
        $('#org-settings-modal').modal('hide');
      });
    };
  }
});
