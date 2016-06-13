import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';

Template.ESIPReviewDates.viewmodel({
  mixin: ['addForm', 'date'],
  reviewDates: [],
  addReviewDate() {
    this.addForm('ESIPReviewDate', {
      datePlaceholder: this.renderDate(new Date()),
      defaultDate: false
    });
  },
  onChangeCb() {
    return this.update.bind(this);
  },
  onDeleteCb() {
    return this.delete.bind(this);
  },
  update(viewModel) {
    const _id = viewModel._id && viewModel._id();
    const { date } = viewModel.getData();

    if (_id) {
      this.set({ _id, date });
    } else {
      this.addToSet({ date }, () => {
        viewModel.destroy();
      });
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
  delete(viewModel) {
    const _id = viewModel._id && viewModel._id();
    const date = this.renderDate(viewModel.getData().date);

    if (!_id) {
      viewModel.destroy();
      return;
    }

    swal({
      title: 'Are you sure?',
      text: `Review date "${date}" will be removed.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      closeOnConfirm: false
    }, () => {
      this.parent().update({}, {
        $pull: {
          reviewDates: { _id }
        }
      }, (err) => {
        if (err) {
          swal('Oops... Something went wrong!', err.reason, 'error');
        } else {
          swal(
            'Removed!',
            `Review date "${date}" was removed successfully.`,
            'success'
          );
        }
      });
    });
  },
  getData() {
    const datepickers = this.children('Datepicker');
    const data = _.map(datepickers, vm => vm.getData());
    const reviewDates = _.map(data, ({ date }) => date);
    return { reviewDates };
  }
});
