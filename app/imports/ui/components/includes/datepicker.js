import { Template } from 'meteor/templating';

Template.Datepicker.viewmodel({
  mixin: 'date',
  onRendered() {
    this.datepickerInit();
    this.datepicker.on('changeDate', (e) => {
      const { date } = e;
      this.value(date);
    });
  },
  label: 'Date',
  sm: 8,
  date: '',
  value: '',
  getData() {
    const date = this.value();
    return { date };
  }
});
