import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';

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
  update({ _id, date }, cb) {
    if (_id) {
      this.set({ _id, date }, cb);
    } else {
      this.addToSet({ date }, cb);
    }
  },
  addToSet({ date }, cb) {
    const options = {};
    const _id = Random.id();
    options['$addToSet'] = {
      'improvementPlan.reviewDates': { _id, date }
    };
    this.parent().update({}, options, cb);
  },
  set({ _id, date }, cb) {
    const query = {
      'improvementPlan.reviewDates': {
        $elemMatch: {
          _id: _id
        }
      }
    };
    const options = {};
    options['$set'] = {
      'improvementPlan.reviewDates.$.date': date
    }
    this.parent().update(query, options, cb);
  },
  getData() {
    const datepickers = ViewModel.find('Datepicker', vm => vm.placeholder && vm.placeholder() === 'Review date');
    const data = _.map(datepickers, vm => vm.getData());
    const reviewDates = _.map(data, ({ date }) => date);
    return { reviewDates };
  }
});
