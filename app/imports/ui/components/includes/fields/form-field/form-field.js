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

    this.templateInstance.$('.guidance-panel').collapse('hide');

    this.templateInstance.$('.btn-collapse').addClass('collapsed');
  },
});
