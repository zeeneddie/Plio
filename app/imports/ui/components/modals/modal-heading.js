Template.ModalHeading.viewmodel({
  isSaving: false,
  closeButtonText() {
    return this.isSaving() ? 'Saving...' : 'Close';
  },
  openGuidancePanel(e) {
    const $button = this.templateInstance.$(e.currentTarget);

    $button
      .closest('.card')
      .find('.guidance-panel')
      .collapse('show');

    $button
      .removeClass('collapsed');
  },
});
