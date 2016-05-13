import { Template } from 'meteor/templating';

Template.ESIPCurrentValue.viewmodel({
  currentValue: '',
  update() {
    const { currentValue } = this.getData();
    this.parent().update({ currentValue });
  },
  getData() {
    const { currentValue } = this.data();
    return { currentValue };
  }
});
