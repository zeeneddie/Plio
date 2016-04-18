import { Organizations } from '/imports/api/organizations/organizations.js';


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
      console.log(this.child('Organizations_NcStepTimes'));
      console.log(this.child('Organizations_NcReminders'));
      console.log(this.child('Organizations_NcGuidelines'));
    };
  }
});
