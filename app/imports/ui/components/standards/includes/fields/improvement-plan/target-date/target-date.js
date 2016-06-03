import { Template } from 'meteor/templating';

Template.ESIPTargetDate.viewmodel({
  mixin: 'date',
  targetDate: '',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel, cb) {
    const { date:targetDate } = viewmodel.getData();
    this.parent().update({ targetDate });
  },
  getTodayDate() {
    return this.renderDate(new Date());
  },
  getDate() {
    return this.targetDate() ? this.renderDate(this.targetDate()) : '';
  },
  getData() {
    const { targetDate } = this.data();
    return { targetDate };
  }
});
