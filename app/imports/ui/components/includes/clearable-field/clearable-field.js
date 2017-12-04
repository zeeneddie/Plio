Template.ClearableField.viewmodel({
  isFocused: false,
  events: {
    'focusin input': function (e) {
      e.stopImmediatePropagation();
      this.isFocused(true);
    },
    'focusout input': function (e) {
      e.stopImmediatePropagation();
      this.isFocused(false);
    },
  },
});
