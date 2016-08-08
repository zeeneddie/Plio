import { Template } from 'meteor/templating';

Template.RCA_TargetDate_Edit.viewmodel({
  key: '',
  date: '',
  startDate: new Date(),
  defaultDate: false,
  placeholder: 'Target date',
  label: 'Target date',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { date } = viewmodel.getData();

    if (date === this.templateInstance.data.date) return;

    this.date(date);

    if (this.key()) {
      this.parent().update({ [this.key()]: date });
    } else if (this.onUpdate) {
      this.onUpdate({ date });
    }
  },
  getData() {
    const { date } = this.data();
    return { date };
  }
});
