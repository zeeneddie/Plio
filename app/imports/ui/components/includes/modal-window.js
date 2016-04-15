Template.ModalWindow.viewmodel({
  onRendered(template) {
    this.modal.on('hide.bs.modal', e => $(template.firstNode).remove());
  }
});
