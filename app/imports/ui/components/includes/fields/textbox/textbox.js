import { Template } from 'meteor/templating';

Template.TextBox.viewmodel({
  value: '',
  className: '',
  placeholder: 'Text',
  rows: 3,
  onFocusOut() {}
});
