import { ViewModel } from 'meteor/manuel:viewmodel';
import { Blaze } from 'meteor/blaze';

import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

Template.UserEdit_PhoneNumbers.viewmodel({
  mixin: ['addForm'],
  addPhoneForm() {
    this.addForm('UserEdit_PhoneNumber', {
      isEditable: this.isEditable(),
    });
  },
  isEditable() {
    return this.parent().isEditable();
  },
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onChange(viewModel) {
    if (viewModel._id) {
      this.parent().updatePhoneNumber(viewModel);
    } else {
      this.parent().addPhoneNumber(viewModel, (err) => {
        if (!err) {
          Blaze.remove(viewModel.templateInstance.view);
        }
      });
    }
  },
  onDeleteCb() {
    return this.onDelete.bind(this);
  },
  onDelete(viewModel) {
    if (!viewModel._id) {
      Blaze.remove(viewModel.templateInstance.view);
      return;
    }

    const { number, type } = viewModel.getData();

    swal({
      title: 'Are you sure?',
      text: `Phone number "${number}" will be removed.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      closeOnConfirm: false,
    }, () => {
      this.parent().removePhoneNumber(viewModel, (err) => {
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
            text: `Phone number "${number}" was removed successfully.`,
            type: 'success',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
          });
        }
      });
    });
  },
  getData() {
    return _.map(this.children('UserEdit_PhoneNumber'), child => child.getData());
  },
});
