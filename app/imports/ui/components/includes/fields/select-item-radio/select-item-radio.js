import { Template } from 'meteor/templating';

Template.SelectItemRadio.viewmodel({
  value: '',
  items: [],
  onSelect() {},
  select({ value = '' }) {
    if (this.value() === value) return;

    this.value(value);

    this.onSelect(this);
  },
  getData() {
    const { value } = this.data();
    return { value };
  }
});
