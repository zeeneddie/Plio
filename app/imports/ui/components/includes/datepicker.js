import { Template } from 'meteor/templating';

Template.Datepicker.viewmodel({
  mixin: 'date',
  onRendered() {
    this.datepicker.datepicker({
      startDate: new Date(),
      format: 'dd MM yyyy',
      autoclose: true
    });

    if (this.date()) {
      this.datepicker.datepicker('setDate', new Date(this.date()));
    } else if (!this.date() && this.defaultDate()) {
      this.datepicker.datepicker('setDate', new Date());
    }

    this.datepicker.on('changeDate', (e) => {
      this.update();
    });
  },
  label: 'Date',
  placeholder: 'Date',
  sm: 8,
  date: '',
  defaultDate: true,
  onUpdate: () => {},
  update() {
    this.onUpdate(this, () => this.destroy());
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
  },
  getData() {
    const date = this.datepicker.datepicker('getDate');
    return { date };
  }
});
