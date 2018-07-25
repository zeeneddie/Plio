import { Template } from 'meteor/templating';

Template.ClearableField.viewmodel({
  isFocused: false,
  events: {
    'focusin input': function () {
      this.isFocused(true);
    },
    'focusout input': function () {
      this.isFocused(false);
    },
  },
});
