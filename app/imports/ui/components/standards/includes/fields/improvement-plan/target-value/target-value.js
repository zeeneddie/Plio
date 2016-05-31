import { Template } from 'meteor/templating';

Template.ESIPTargetValue.viewmodel({
  mixin: 'clearableField',
  targetValue: '',
  update(e) {
    this.callWithFocusCheck(e, () => {
      const { targetValue } = this.getData();
      this.parent().update({ targetValue });
    });
  },
  getData() {
    const { targetValue } = this.data();
    return { targetValue };
  }
});
