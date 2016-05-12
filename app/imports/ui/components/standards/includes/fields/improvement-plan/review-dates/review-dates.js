import { Template } from 'meteor/templating';

Template.ESIPReviewDates.viewmodel({
  mixin: 'addForm',
  addReviewDate() {
    this.addForm(
      'Datepicker',
      { class: 'margin-bottom', placeholder: 'Review date', isEditable: true }
    );
  },
  update() {
    console.log(this.getData());
  },
  getData() {
    const datepickers = ViewModel.find('Datepicker', vm => vm.placeholder && vm.placeholder() === 'Review Date');
    const data = _.map(datepickers, vm => vm.getData());
    const dates = _.map(data, ({ date }) => date);
    return { dates };
  }
});
