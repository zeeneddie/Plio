import { ViewModel } from 'meteor/manuel:viewmodel';
import { Blaze } from 'meteor/blaze';


Template.UserEdit_PhoneNumbers.viewmodel({
  mixin: ['addForm'],
  addPhoneForm() {
    this.addForm('UserEdit_PhoneNumber', {
      isEditable: this.isEditable()
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
      closeOnConfirm: false
    }, () => {
      this.parent().removePhoneNumber(viewModel, (err) => {
        if (err) {
          swal('Oops... Something went wrong!', err.reason, 'error');
        } else {
          swal(
            'Removed!',
            `Phone number "${number}" was removed successfully.`,
            'success'
          );
        }
      });
    });
  },
  getData() {
    return _.map(this.children('UserEdit_PhoneNumber'), (child) => {
      return child.getData();
    });
  }
});
