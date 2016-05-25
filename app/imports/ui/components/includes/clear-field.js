import { Template } from 'meteor/templating';

Template.ClearField.viewmodel({
  field: '',
  clearFn: '',
  clearField() {
    this.templateInstance
      .$('.clear-field')
      .siblings('input')
      .focus();
    if (this.field()) {
      this.parent()[this.field()]('');
    } else if (this.clearFn()) {
      this.parent()[this.clearFn()]();
    }
  },
  editable() {
    return this.isEditable && this.isEditable();
  }
});
