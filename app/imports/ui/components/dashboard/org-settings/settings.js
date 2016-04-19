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
      const mainSettings = this.child('Organizations_MainSettings').getData();
      const ncStepTimes = this.child('Organizations_NcStepTimes').getData();
      const ncReminders = this.child('Organizations_NcReminders').getData();
      const ncGuidelines = this.child('Organizations_NcGuidelines').getData();

      console.log(mainSettings);
      console.log(ncStepTimes);
      console.log(ncReminders);
      console.log(ncGuidelines);
    };
  }
});
