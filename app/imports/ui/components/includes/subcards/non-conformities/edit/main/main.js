import { Template } from 'meteor/templating';

Template.EditNC_Main.viewmodel({
  onUpdate() {},
  update(...args) {
    this.onUpdate(...args);
  }
});
