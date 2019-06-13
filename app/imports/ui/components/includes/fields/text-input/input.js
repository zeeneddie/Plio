import { Template } from 'meteor/templating';

Template.TextInput.viewmodel({
  value: '',
  className: '',
  enable: true,
  placeholder: '',
  autoComplete: 'off',
  autoFocus: false,
  onFocusOut() {},
  onRendered(templateInstance) {
    if (this.autoFocus()) {
      const input = templateInstance.firstNode;
      setTimeout(() => input.focus(), 500);
    }
  },
});
