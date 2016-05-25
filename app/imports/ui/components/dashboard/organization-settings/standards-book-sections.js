import {
  StandardsBookSections
} from '/imports/api/standards-book-sections/standards-book-sections.js';
import {
  insert, update, remove
} from '/imports/api/standards-book-sections/methods.js';

Template.OrganizationSettings_StandardsBookSections.viewmodel({
  mixin: ['collapse', 'addForm', 'modal'],
  standardsBookSectionsCount() {
    return StandardsBookSections.find({
      organizationId: this.organizationId()
    }).count();
  },
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onDeleteCb() {
    return this.onDelete.bind(this);
  },
  onChange(viewModel) {
    const { title } = viewModel.getData();
    const organizationId = this.organizationId();

    if (!viewModel._id) {
      Blaze.remove(viewModel.templateInstance.view);

      this.modal().callMethod(insert, {
        title, organizationId
      });
    } else {
      const _id = viewModel._id();

      this.modal().callMethod(update, { _id, title, organizationId });
    }
  },
  onDelete(viewModel) {
    if (!viewModel._id) {
      Blaze.remove(viewModel.templateInstance.view);
      return;
    }

    const { title } = viewModel.getData();

    swal({
      title: 'Are you sure?',
      text: `Book section "${title}" will be removed.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      closeOnConfirm: false
    }, () => {
      const _id = viewModel._id();
      const organizationId = this.organizationId();

      this.modal().callMethod(remove, { _id, organizationId }, (err) => {
        if (err) {
          swal('Oops... Something went wrong!', err.reason, 'error');
        } else {
          swal(
            'Removed!',
            `Book section "${title}" was removed succesfully.`,
            'success'
          );
        }
      });
    });
  }
});
