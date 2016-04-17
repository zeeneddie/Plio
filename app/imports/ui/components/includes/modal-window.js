/*
  To use modal window component you first need to add a click handler to some button and write:

  Blaze.renderWithData(
    Template.ModalWindow,
    {
      template: String, // name of the template to be the content of the modal
      name: String,
      title: String
    },
    document.body
  );

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
  onRendered(template) {
    this.modal.on('hidden.bs.modal', e => Blaze.remove(template.view));
  }
});
