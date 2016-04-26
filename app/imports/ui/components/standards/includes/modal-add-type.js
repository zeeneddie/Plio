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
        closeText: 'Cancel',
        hint: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vestibulum accumsan nulla, non pulvinar neque. Quisque faucibus tempor imperdiet. Suspendisse feugiat, nibh nec maximus pellentesque, massa nunc mattis ipsum, in dictum magna arcu et ipsum.',
        isSave: true
      });
    }, 400);
  }
});
