import { Template } from 'meteor/templating';

Template.HelpInfo.viewmodel({
  mixin: ['collapse'],
  helpText: 'No help message yet',
  closeHelpPanel(e) {
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
