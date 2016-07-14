import { Template } from 'meteor/templating';

Template.NC_RCA_TargetDate_Edit.viewmodel({
  targetDate: '',
  defaultDate: false,
  placeholder: 'Target date',
  label: 'Target date',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { date:targetDate } = viewmodel.getData();

    if (targetDate === this.templateInstance.data.targetDate) {
      return;
    }

    this.targetDate(targetDate);

    this.parent().updateAnalysisTargetDate({ targetDate });
  },
  getData() {
    const { date } = this.data();
    return { date };
  }
});
