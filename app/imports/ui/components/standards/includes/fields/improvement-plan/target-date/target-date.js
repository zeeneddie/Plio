import { Template } from 'meteor/templating';

Template.ESIPTargetDate.viewmodel({
  mixin: 'date',
  targetDate: '',
  update({ date:targetDate }) {
    this.parent().update({ targetDate });
  },
  getDate() {
    return this.targetDate() ? this.renderDate(this.targetDate()) : '';
  },
  getData() {
    const { targetDate } = this.data();
    return { targetDate };
  }
});
