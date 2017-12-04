import { Template } from 'meteor/templating';

import { Blaze } from 'meteor/blaze';

Template.IP_ReviewDate_Edit.viewmodel({
  mixin: ['date'],
  _id: '',
  date: '',
  placeholder: 'Review date',
  defaultDate: false,
  onDateChangeCb() {
    return this.onDateChange.bind(this);
  },
  onDateChange(viewmodel) {
    const { date } = viewmodel.getData();
    this.date(date);
    this.onChange(this);
  },
  onDeleteCb() {
    return this.delete.bind(this);
  },
  delete(viewmodel) {
    this.onDelete(this);
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
  },
  getData() {
    return {
      _id: this._id(),
      date: this.date(),
    };
  },
});
