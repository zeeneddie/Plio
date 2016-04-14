Template.ModalHeading.events({
  'click .modal-save'(e, tpl) {
    tpl.data.onSave(e, tpl);
  },
  'click .guidance-panel-open'(e, tpl) {
    const $button = tpl.$(e.currentTarget);

    $button
      .closest('.card')
      .find('.guidance-panel')
      .collapse('show');

    $button
      .closest('button')
      .removeClass('collapsed');
  }
});
