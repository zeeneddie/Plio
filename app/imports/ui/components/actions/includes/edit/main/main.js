import { Template } from 'meteor/templating';

Template.Actions_Edit_Main.viewmodel({
  update(...args) {
    this.parent().update(...args);
  }
});
