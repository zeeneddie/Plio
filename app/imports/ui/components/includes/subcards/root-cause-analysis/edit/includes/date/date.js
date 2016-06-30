import { Template } from 'meteor/templating';

Template.NCRCADate.viewmodel({
  key: 'analysis',
  date: '',
  startDate: new Date(),
  defaultDate: false,
  placeholder: 'Target date',
  label: 'Target date',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { date:date } = viewmodel.getData();

    if (date === this.templateInstance.data.date) return;

    this.date(date);

    this.parent().update({ [this.key()]: date });
  },
  getData() {
    const { date } = this.data();
    return { date };
  }
});
