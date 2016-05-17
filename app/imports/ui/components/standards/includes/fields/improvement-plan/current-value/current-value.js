import { Template } from 'meteor/templating';

Template.ESIPCurrentValue.viewmodel({
  mixin: ['modal', 'clearableField'],
  currentValue: '',
  update() {
    this.callWithFocusCheck(() => {
      const { currentValue } = this.getData();
      this.parent().update({ currentValue });
    });
  },
  getData() {
    const { currentValue } = this.data();
    return { currentValue };
  }
});
