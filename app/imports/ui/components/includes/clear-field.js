import { Template } from 'meteor/templating';

Template.ClearField.viewmodel({
  field: '',
  clearField() {
    this.parent()[this.field()]('');
    !!this.editable() && this.parent().update();
  },
  editable() {
    return this.isEditable && this.isEditable();
  }
});
