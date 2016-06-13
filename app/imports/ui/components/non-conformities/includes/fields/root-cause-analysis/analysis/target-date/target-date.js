import { Template } from 'meteor/templating';

Template.NCRCATargetDate.viewmodel({
  targetDate: '',
  defaultDate: false,
  placeholder: 'Target date',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { date:targetDate } = viewmodel.getData();

    if (targetDate === this.templateInstance.data.targetDate) return;

    this.targetDate(targetDate);

    this.parent().update({ 'analysis.targetDate': targetDate });
  },
  getData() {
    const { targetDate } = this.data();
    return { targetDate };
  }
});
