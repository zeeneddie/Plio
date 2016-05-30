import { Template } from 'meteor/templating';

Template.Datepicker.viewmodel({
  mixin: 'date',
  onRendered() {
    this.datepicker.datepicker({
      startDate: new Date(),
      format: 'dd MM yyyy',
      autoclose: true
    });

    !!this.date() ? this.datepicker.datepicker('setDate', new Date(this.date())) : this.datepicker.datepicker('setDate', new Date());

    this.datepicker.on('changeDate', (e) => {
      this.update();
    });
  },
  isEditable: false,
  label: 'Date',
  sm: 8,
  date: '',
  update() {
    const update = ({ ...args }) => {
      !!(this.parent && this.parent()) ? this.parent().update({ ...args }, this.destroy()) : this.parentVM().update({ ...args }, this.destroy());
    }

    if (this.isEditable()) {
      const { date } = this.getData();

      if (!this._id) {
        update({ date });
      } else {
        const _id = this._id();
        update({ _id, date });
      }
    }
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
  },
  getData() {
    const date = this.datepicker.datepicker('getDate');
    return { date };
  }
});
