import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';

import { getTzTargetDate } from '/imports/share/helpers';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';


Template.IP_ReviewDate_Edits.viewmodel({
  mixin: ['addForm', 'date', 'organization'],
  reviewDates: [],
  addReviewDate() {
    this.addForm('IP_ReviewDate_Edit', {
      placeholder: this.renderDate(new Date()),
      defaultDate: false,
      onChange: this.update.bind(this),
      onDelete: this.delete.bind(this),
    });
  },
  onChangeCb() {
    return this.update.bind(this);
  },
  onDeleteCb() {
    return this.delete.bind(this);
  },
  update(viewmodel) {
    const _id = viewmodel._id && viewmodel._id();

    const { timezone } = this.organization();
    let { date } = viewmodel.getData();
    date = getTzTargetDate(date, timezone);

    if (_id) {
      this.set({ _id, date });
    } else {
      this.addToSet({ date });
    }

    viewmodel.destroy();
  },
  addToSet({ date }, cb) {
    const options = {};
    const _id = Random.id();

    options.$addToSet = {
      'improvementPlan.reviewDates': { _id, date },
    };

    if (this.parent().doc()) {
      this.parent().update({ options }, cb);
    } else {
      this.parent().insert({ reviewDates: [{ _id, date }] }, cb);
    }
  },
  set({ _id, date }, cb) {
    const query = {
      'improvementPlan.reviewDates': {
        $elemMatch: { _id },
      },
    };

    const options = {};

    options.$set = {
      'improvementPlan.reviewDates.$.date': date,
    };

    this.parent().update({ query, options }, cb);
  },
  delete(viewmodel) {
    const _id = viewmodel._id && viewmodel._id();
    const date = this.renderDate(viewmodel.getData().date);

    if (!_id) {
      viewmodel.destroy();
      return;
    }

    swal({
      title: 'Are you sure?',
      text: `Review date "${date}" will be removed.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      closeOnConfirm: false,
    }, () => {
      const options = {
        $pull: {
          'improvementPlan.reviewDates': { _id },
        },
      };

      const cb = (err) => {
        if (err) {
          swal({
            title: 'Oops... Something went wrong!',
            text: err.reason,
            type: 'error',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
          });
        } else {
          swal({
            title: 'Removed!',
            text: `Review date "${date}" was removed successfully.`,
            type: 'success',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
          });
        }
      };

      this.parent().update({ options }, cb);
    });
  },
  getData() {
    const datepickers = this.children('Datepicker');
    const data = _.map(datepickers, vm => vm.getData());
    const reviewDates = _.map(data, ({ date }) => date);
    return { reviewDates };
  },
});
