/*
  To use modal window component you first need to import it:
  import { Modal } from '../../includes/constants.js';
  Then you need to add a click handler to some button:
  openSettingsModal(e) {
    Modal.open({
      template: String, // name of the template to be the content of the modal
      title: String,
      hint: String,
      saveButtonText: String
    });
  }
  Next you need to create a save function in the content's viewmodel:
  Template.content.viewmodel({
    save() {
      // do something on save
    }
  });
  And that's it!
*/

import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

Template.ModalWindow.viewmodel({
  share: 'collapse',
  onRendered(template) {
    this.modal.modal('show');
    this.modal.on('hidden.bs.modal', e => Blaze.remove(template.view));
  }
});
