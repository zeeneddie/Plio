Template.FormField.viewmodel({
  mixin: ['collapse'],
  isInvalid: false,
  sm: 8,
  calcLabelCol() {
    const col = parseInt(this.sm(), 10);
    return 12 - col;
  },
  closeHelpPanel(e) {
    const $a = this.templateInstance.$(e.currentTarget);

    $a
      this.templateInstance.$('.guidance-panel')
      .collapse('hide');

    $a
      this.templateInstance.$('.guidance-panel-open')
      .addClass('collapsed');
  }
});
