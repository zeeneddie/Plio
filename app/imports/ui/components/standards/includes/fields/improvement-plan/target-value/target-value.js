import { Template } from 'meteor/templating';

Template.ESIPTargetValue.viewmodel({
  targetValue: '',
  update() {
    const { targetValue } = this.getData();
    this.parent().update({ targetValue });
  },
  getData() {
    const { targetValue } = this.data();
    return { targetValue };
  }
});
