import { Template } from 'meteor/templating';


Template.Actions_Edit.viewmodel({
  mixin: ['collapse', 'modal', 'addForm', 'organization'],
  _id: '',
  title: '',
  status: 0,
  onCreated() {
    const action = this.action && this.action();
    action && this.load(action);
  },
  getData() {
    return { title: this.title() };
  }
});
