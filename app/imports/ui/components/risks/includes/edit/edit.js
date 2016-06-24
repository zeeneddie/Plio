import { Template } from 'meteor/templating';

Template.EditRisk.viewmodel({
  mixin: ['risk', 'organization'],
  document: '',
  update(...args) {
    return this.parent().update(...args);
  }
});
