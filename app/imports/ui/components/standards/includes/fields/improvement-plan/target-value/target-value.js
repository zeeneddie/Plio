import { Template } from 'meteor/templating';

Template.ESIPTargetValue.viewmodel({
  mixin: ['modal', 'clearableField'],
  targetValue: '',
  update() {
    this.callWithFocusCheck(() => {
      const { targetValue } = this.getData();
      this.parent().update({ targetValue });
    });
  },
  getData() {
    const { targetValue } = this.data();
    return { targetValue };
  }
});
