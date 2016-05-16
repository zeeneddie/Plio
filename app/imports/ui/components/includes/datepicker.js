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
      if (!this._id) {
        !!(this.parent && this.parent()) ? this.parent().update({ date }, this.onAfterUpdate()) : this.parentVM().update({ date }, this.onAfterUpdate());
      } else {
        const _id = this._id();
        !!(this.parent && this.parent()) ? this.parent().update({ date, _id }, this.onAfterUpdate()) : this.parentVM().update({ date, _id }, this.onAfterUpdate());
      }
    }
  },
  onAfterUpdate() {
    Blaze.remove(this.templateInstance.view);
  },
  getData() {
    const date = this.value();
    return { date };
  }
});
