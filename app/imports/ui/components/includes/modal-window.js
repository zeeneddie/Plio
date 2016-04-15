import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

Template.ModalWindow.viewmodel({
  onRendered(template) {
    this.modal.on('hidden.bs.modal', e => Blaze.remove(template.view));
  }
});
