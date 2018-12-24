import { Template } from 'meteor/templating';

Template.TextInput.viewmodel({
  value: '',
  className: '',
  enable: true,
  placeholder: '',
  autoComplete: 'off',
  onFocusOut() {},
});
