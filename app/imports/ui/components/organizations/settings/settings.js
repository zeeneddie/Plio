import { Organizations } from '/imports/api/organizations/organizations.js';


Template.Organizations_Settings.helpers({
  org() {
    // temporary!
    return Organizations.findOne();
  },
  onSave() {
    // temporary!
    return () => console.log('on save');
  }
});
