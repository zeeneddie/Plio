Template.GuidancePanel.events({
  'click .guidance-panel-close'(e, tpl) {
    const $a = tpl.$(e.target);

    $a
      .closest('.guidance-panel')
      .collapse('hide');

    $a
      .closest('.card')
      .find('.guidance-panel-open')
      .addClass('collapsed');
  }
});
