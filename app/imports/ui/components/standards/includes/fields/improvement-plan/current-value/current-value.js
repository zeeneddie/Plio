import { Template } from 'meteor/templating';

Template.ESIPCurrentValue.viewmodel({
  mixin: ['clearableField'],
  currentValue: '',
  update(e) {
    this.callWithFocusCheck(e, () => {
      const { currentValue } = this.getData();
      this.parent().update({ currentValue });
    });
  },
  getData() {
    const { currentValue } = this.data();
    return { currentValue };
  }
});
