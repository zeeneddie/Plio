/*
  To use modal window component you first need to add modal mixin to your viewmodel:

  mixin: {
    modal: 'modal'
  }

  Then you need to add a click handler to some button:
  openSettingsModal(e) {
    this.modal.open({
      template: String, // name of the template to be the content of the modal
      title: String,
      hint: String,
      simple: Boolean, // for a 'simple' variation
      isSave: Boolean, // for a 'save' variation
      closeText: String // Optional. Default to 'Close'
    });
  }
  And that's it!
*/

import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

Template.ModalWindow.viewmodel({
  mixin: 'collapse',
  onRendered(template) {
    this.modal.modal('show');
    this.modal.on('hidden.bs.modal', e => Blaze.remove(template.view));
  }
});
