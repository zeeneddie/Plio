Template.ModalHeading.viewmodel((context = {}) => {
  const {
    onClose = () => {}
  } = context;

  return {
    onClose: onClose,
    saving: false,
    closeButtonText() {
      return this.saving() ? 'Saving...' : 'Close';
    },
    openGuidancePanel(e) {
      const $button = this.templateInstance.$(e.currentTarget);

      $button
        .closest('.card')
        .find('.guidance-panel')
        .collapse('show');

      $button
        .removeClass('collapsed');
    }
  };
});
