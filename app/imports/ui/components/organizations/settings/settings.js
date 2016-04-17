import { Organizations } from '/imports/api/organizations/organizations.js';


Template.Organizations_Settings.helpers({
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
    return () => console.log('on save');
  }
});
