import { Template } from 'meteor/templating';

Template.ESIPReviewDates.viewmodel({
  mixin: ['addForm', 'date'],
  reviewDates: [],
  addReviewDate() {
    this.addForm(
      'Datepicker',
      { class: 'margin-bottom', placeholder: 'Review date', isEditable: true, parentVM: this }
    );
  },
  reviewDatesSorted() {
    return this.reviewDates().sort((a, b) => new Date(a) - new Date(b));
  },
  update({ date }) {
    const { reviewDates } = this.getData();
    const options = {};
    options['$addToSet'] = {
      'improvementPlan.reviewDates': date
    };
    this.parent().update({}, options);
  },
  getData() {
    const datepickers = ViewModel.find('Datepicker', vm => vm.placeholder && vm.placeholder() === 'Review date');
    const data = _.map(datepickers, vm => vm.getData());
    const reviewDates = _.map(data, ({ date }) => date);
    return { reviewDates };
  }
});
