import { Template } from 'meteor/templating';

Template.InputField.viewmodel({
  value: '',
  update(e) {
    const { value } = this.getData();

    if (value === this.templateInstance.data.value) return;

    return this.parent().update(e, this);
  },
  getData() {
    const { value } = this.data();
    return { value };
  }
});
