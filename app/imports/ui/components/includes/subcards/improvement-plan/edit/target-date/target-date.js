import { Template } from 'meteor/templating';

Template.IPTargetDate.viewmodel({
  mixin: 'date',
  targetDate: '',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel, cb) {
    const { date:targetDate } = viewmodel.getData();

    this.targetDate(targetDate);

    if (targetDate === this.templateInstance.data.targetDate) return;

    this.parent().update({ targetDate }, cb);
  },
  getTodayDate() {
    return this.renderDate(new Date());
  },
  getData() {
    const { targetDate } = this.data();
    return { targetDate };
  }
});
