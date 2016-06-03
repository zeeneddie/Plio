import { Template } from 'meteor/templating';

Template.InputField.viewmodel({
  value: '',
  onUpdate() {},
  update(e) {
    const { value } = this.getData();

    if (value === this.templateInstance.data.value) return;

    return this.onUpdate(this);
  },
  getData() {
    const { value } = this.data();
    return { value };
  }
});
