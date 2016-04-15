Template.ModalWindow.viewmodel({
  onRendered(template) {
    this.modal.on('hidden.bs.modal', e => Blaze.remove(template.view));
  }
});
