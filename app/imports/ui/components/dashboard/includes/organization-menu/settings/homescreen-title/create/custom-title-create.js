import { Template } from 'meteor/templating';

Template.CustomTitleCreate.viewmodel({
  mixin: ['organization', 'modal'],
  sectionHintText() {
    return !!this.value() ? `Add "${this.value()}" title` : 'Start typing...';
  },
  addNewSection() {
    if (!this.value()) return;

    const newItem = { _id: this.value(), title: this.value() };
    const parent = this.parent();

    parent.items([
      ...parent.items(),
      newItem,
    ]);

    parent.select(newItem);
  },
  getData() {
    const { value, selected } = this.data();
    return { value, selected };
  },
});
