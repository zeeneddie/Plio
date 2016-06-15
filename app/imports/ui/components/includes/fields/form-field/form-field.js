Template.FormField.viewmodel({
  isInvalid: false,
  sm: 8,
  calcLabelCol() {
    const col = parseInt(this.sm(), 10);
    return 12 - col;
  }
});
