import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.AddStandardType.viewmodel({
  mixin: {
    modal: 'modal'
  },
  openEditSectionModal() {
    this.modal.destroy();
    Meteor.setTimeout(() => {
      this.modal.open({
        title: 'Standard',
        template: 'EditStandard',
        closeText: 'Cancel'
      });
    }, 400);
  }
});
