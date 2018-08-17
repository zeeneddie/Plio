Template.GuidancePanel.viewmodel({
  closeGuidancePanel(e) {
    const $a = this.templateInstance.$(e.target);

    $a
      .closest('.guidance-panel')
      .collapse('hide');

    $a
      .closest('.card')
      .find('.guidance-panel-open')
      .addClass('collapsed');
  },
});
