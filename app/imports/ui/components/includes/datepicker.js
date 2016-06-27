import { Template } from 'meteor/templating';

Template.Datepicker.viewmodel({
  mixin: 'date',
  onRendered() {
    this.datepicker.datepicker({
      startDate: this.startDate(),
      format: {
        toDisplay: (date, format, language) => {
          return this.renderDate(date);
        },
        toValue: (date, format, language) => {
          return date;
        }
      },
      autoclose: true
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
  }
});
