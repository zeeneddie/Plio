import { Template } from 'meteor/templating';


Template.Actions_Edit.viewmodel({
  mixin: ['collapse', 'modal', 'addForm', 'organization'],
  _id: '',
  title: '',
  onCreated() {
    const action = this.action && this.action();
    action && this.load(action);
  },
  getData() {
    return { title: 'fuck you' };
  }
});
