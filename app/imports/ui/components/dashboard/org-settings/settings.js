import { Organizations } from '/imports/api/organizations/organizations.js';
import { update } from '/imports/api/organizations/methods.js'


Template.Organizations_Settings.viewmodel({
  saving(val) {
    const modalHeading = this.child('ModalHeading');

    if (val !== undefined) {
      modalHeading.saving(val);
    }

    return modalHeading.saving();
  },
  organization() {
    // temporary!
    return Organizations.findOne();
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

      this.saving(true);

      update.call({
        _id, name, currency, ncStepTimes,
        ncReminders, ncGuidelines
      }, (err, res) => {
        if (err) {
          toastr.error(err);
        } else {
          toastr.success('Organization has been updated');
        }

        this.saving(false);
        $('#org-settings-modal').modal('hide');
      });
    };
  }
});
