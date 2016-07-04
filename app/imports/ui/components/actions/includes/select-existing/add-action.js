import { Template } from 'meteor/templating';


Template.Actions_DropdownAddAction.viewmodel({
  value: '',
  hintText() {
    return this.value() ? `Add "${this.value()}" action` : 'Start typing...';
  },
  addAction() {
    const actionTitle = this.value();
    actionTitle && this.onAdd && this.onAdd(actionTitle);
  }
});
