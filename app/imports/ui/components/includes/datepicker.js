import { Template } from 'meteor/templating';

Template.Datepicker.viewmodel({
  mixin: 'date',
  onRendered() {
    this.datepickerInit();
    this.datepicker.on('changeDate', (e) => {
      const { date } = e;

      this.value(date);

      this.update();
    });
  },
  label: 'Date',
  sm: 8,
  date: '',
  value: '',
  update() {
    if (this.isEditable && this.isEditable()) {
      const { date } = this.getData();
      !!(this.parent && this.parent()) ? this.parent().update({ date }) : this.parentVM().update({ date });
    }
  },
  getData() {
    const date = this.value();
    return { date };
  }
});
