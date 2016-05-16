import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.AddStandardType.viewmodel({
  mixin: 'modal',
  openCreateStandardModal() {
    this.modal().close();
    Meteor.setTimeout(() => {
      this.modal().open({
        title: 'Standard',
        template: 'CreateStandard',
        variation: 'save'
      });
    }, 400);
  }
});
