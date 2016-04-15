import { Organizations } from '/imports/api/organizations/organizations.js';


Template.Organizations_Settings.helpers({
  organization() {
    // temporary!
    return Organizations.findOne();
  },
  workflowDefaults() {
    // temporary!
    return Organizations.findOne().ncStepTimes;
  },
  onSave() {
    // temporary!
    return () => console.log('on save');
  }
});
