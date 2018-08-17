import { Template } from 'meteor/templating';

Template.Datepicker.viewmodel({
  mixin: 'date',
  onRendered() {
    this.datepicker.datepicker({
      // BUG: if date is less than startDate, it is not displayed in text input
      // startDate: this.startDate(),
      endDate: this.endDate(),
      todayHighlight: true,
      format: 'dd M yyyy',
      autoclose: true,
    });

    if (this.date()) {
      this.datepicker.datepicker('setDate', this.date());
    } else if (!this.date() && this.defaultDate()) {
      this.datepicker.datepicker('setDate', new Date());
    }

    this.datepicker.on('change', (e) => {
      this.onChange && this.onChange(this);
    });
  },
  label: 'Date',
  placeholder: 'Date',
  sm: 8,
  startDate: new Date(),
  endDate: Infinity,
  defaultDate: true,
  date: '',
  enabled: true,
  dateString() {
    return this.date() ? this.renderDate(this.date()) : '';
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
  },
  getData() {
    const date = this.datepicker.datepicker('getDate');
    return { date };
  },
});
