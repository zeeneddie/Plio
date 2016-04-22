export const Modal = {
  open(data) {
    Blaze.renderWithData(Template.ModalWindow, data, document.body);
  }
};
