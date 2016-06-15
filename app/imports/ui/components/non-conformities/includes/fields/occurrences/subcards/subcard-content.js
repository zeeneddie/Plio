import { Template } from 'meteor/templating';

Template.NCOccurrencesSubCardContent.viewmodel({
  date: new Date(),
  description: '',
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onChange(viewmodel) {
    const { date } = viewmodel.getData();

    this.date(date);
  },
  getData() {
    const { description, date } = this.data();
    return { description, date };
  }
});
