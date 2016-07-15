import { Template } from 'meteor/templating';

Template.Select_Single_Radio.viewmodel({
  value: '',
  items: [],
  onSelect() {},
  select({ value = '' }) {
    if (this.value() === value) return;

    this.value(value);

    this.update(this);
  },
  getData() {
    const { value } = this.data();
    return { value };
  }
});
