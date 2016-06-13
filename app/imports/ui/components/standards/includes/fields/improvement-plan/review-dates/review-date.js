import { Template } from 'meteor/templating';


Template.ESIPReviewDate.viewmodel({
  mixin: ['date'],
  _id: '',
  date: '',
  datePlaceholder: 'Review date',
  defaultDate: false,
  getDate() {
    return this.date() || '';
  },
  onDateChangeCb() {
    return this.onDateChange.bind(this);
  },
  onDateChange(viewModel) {
    const { date } = viewModel.getData();
    this.date(date);
    this.onChange(this);
  },
  onDeleteCb() {
    return this.delete.bind(this);
  },
  delete(viewModel) {
    this.onDelete(this);
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
  },
  getData() {
    return {
      _id: this._id(),
      date: this.date()
    };
  }
});
