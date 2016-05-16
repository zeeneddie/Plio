import { Template } from 'meteor/templating';

Template.ClearField.viewmodel({
  field: '',
  clearField() {
    this.templateInstance
      .$('.clear-field')
      .siblings('input')
      .focus();
    this.parent()[this.field()]('');
  },
  editable() {
    return this.isEditable && this.isEditable();
  }
});
