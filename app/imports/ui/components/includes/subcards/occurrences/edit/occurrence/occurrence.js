import { Template } from 'meteor/templating';

Template.Subcards_Occurrence.viewmodel({
  date: new Date(),
  description: '',
  onDateChangedCb() {
    return this.onDateChanged.bind(this);
  },
  onDateChanged(viewmodel) {
    const { date } = viewmodel.getData();
    this.date(date);
    this.parent().update({ date });
  },
  updateDescription(e) {
    const { description } = this.getData();
    this.parent().update({ description, e, withFocusCheck: true });
  },
  getData() {
    const { description, date } = this.data();
    return { description, date };
  }
});
