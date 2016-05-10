Template.FormField.viewmodel({
  isInvalid: false,
  hideLabel() {
    return !this.label || !this.label();
  }
});
