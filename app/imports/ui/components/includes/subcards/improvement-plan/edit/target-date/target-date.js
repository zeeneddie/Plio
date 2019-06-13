import { Template } from 'meteor/templating';

Template.IP_TargetDate_Edit.viewmodel({
  mixin: 'date',
  targetDate: '',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel, cb) {
    const { date: targetDate } = viewmodel.getData();

    this.targetDate(targetDate);

    if (targetDate === this.templateInstance.data.targetDate) return;

    this.parent().update({ 'improvementPlan.targetDate': targetDate }, cb);
  },
  getTodayDate() {
    return this.renderDate(new Date());
  },
  onDelete() {
    this.targetDate(null);

    this.parent().update({ 'improvementPlan.targetDate': this.targetDate() });
  },
  getData() {
    const { targetDate } = this.data();
    return { targetDate };
  },
});
