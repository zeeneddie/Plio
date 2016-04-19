import { Organizations } from '/imports/api/organizations/organizations.js';
import { update } from '/imports/api/organizations/methods.js'


Template.Organizations_Settings.viewmodel({
  organization() {
    // temporary!
    return Organizations.findOne();
  },
  stepTimes() {
    // temporary!
    return Organizations.findOne().ncStepTimes;
  },
  reminders() {
    // temporary!
    return Organizations.findOne().ncReminders;
  },
  guidelines() {
    // temporary!
    return Organizations.findOne().ncGuidelines;
  },
  onSave() {
    // temporary!
    return () => {
      const { name, currency } = this.child('Organizations_MainSettings').getData();
      const ncStepTimes = this.child('Organizations_NcStepTimes').getData();
      const ncReminders = this.child('Organizations_NcReminders').getData();
      const ncGuidelines = this.child('Organizations_NcGuidelines').getData();

      const _id = this.organization()._id;

      update.call({
        _id, name, currency, ncStepTimes,
        ncReminders, ncGuidelines
      }, (err, res) => {
        if (err) toastr.error(err);
      });
    };
  }
});
