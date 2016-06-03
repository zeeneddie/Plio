import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';

Template.ESIPReviewDates.viewmodel({
  mixin: ['addForm', 'date'],
  reviewDates: [],
  addReviewDate() {
    this.addForm(
      'Datepicker',
      { class: 'margin-bottom', placeholder: this.renderDate(new Date()), defaultDate: false, onUpdate: this.update.bind(this) }
    );
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel, cb) {
    const { date } = viewmodel.getData();
    const _id = viewmodel._id && viewmodel._id();

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
      'reviewDates': { _id, date }
    };

    this.parent().improvementPlan() ? this.parent().update({}, options, cb) : this.parent().insert({ reviewDates: [{ _id, date }] }, cb);
  },
  set({ _id, date }, cb) {
    const query = {
      'reviewDates': {
        $elemMatch: {
          _id: _id
        }
      }
    };

    const options = {};

    options['$set'] = {
      'reviewDates.$.date': date
    }

    this.parent().update({ query }, options, cb);
  },
  getData() {
    const datepickers = this.children('Datepicker');
    const data = _.map(datepickers, vm => vm.getData());
    const reviewDates = _.map(data, ({ date }) => date);
    return { reviewDates };
  }
});
