import { Template } from 'meteor/templating';

Template.NCOccurrencesSubCardContent.viewmodel({
  date: new Date(),
  description: '',
  onDateChangedCb() {
    return this.onDateChanged.bind(this);
  },
  onDateChanged(viewmodel) {
    const { date } = viewmodel.getData();
    this.date(date);
    this.parent().update(null, 'date');
  },
  updateDescription(e) {
    this.parent().update(e, 'description', true);
  },
  getData() {
    const { description, date } = this.data();
    return { description, date };
  }
});
