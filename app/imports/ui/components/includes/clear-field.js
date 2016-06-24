import { Template } from 'meteor/templating';

Template.ClearField.viewmodel({
  field: '',
  clearFn: null,
  clearField() {
    this.templateInstance
      .$('.clear-field')
      .closest('.clearable-field-container')
      .find('input')
      .focus();
    if (this.field()) {

      // this.parent() is Template.ClearableField 
      this.parent().parent()[this.field()]('');
    } else if (this.clearFn) {
      this.parent().parent()[this.clearFn()]();
    }
  },
  editable() {
    return this.isEditable && this.isEditable();
  }
});
