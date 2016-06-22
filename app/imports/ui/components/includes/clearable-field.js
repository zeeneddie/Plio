Template.ClearableField.viewmodel({
  isFocused: false,
  events: {
    'focusin input'(e) {
      e.stopImmediatePropagation();
      this.isFocused(true);
    },
    'focusout input'(e) {
      e.stopImmediatePropagation();
      this.isFocused(false);
    }
  }
});