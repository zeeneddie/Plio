import { Template } from 'meteor/templating';

Template.ClearField.viewmodel({
  field: '',
  clearFn: null,
  clearField() {
    const input = this.templateInstance
      .$('.clear-field')
      .closest('.clearable-field-container')
      .find('input')[0];

    input.value = '';
    input.focus();

    if (this.clearFn()) {
      this.parent().parent()[this.clearFn()]();
    }
  },
  editable() {
    return this.isEditable && this.isEditable();
  },
});
