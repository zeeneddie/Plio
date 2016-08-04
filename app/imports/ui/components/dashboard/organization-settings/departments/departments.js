import { Template } from 'meteor/templating';
import { invoke } from 'lodash';

import { Departments } from '/imports/api/departments/departments.js';
import { insert, update, remove } from '/imports/api/departments/methods.js';


Template.OrgSettings_Departments.viewmodel({
  mixin: ['addForm', 'modal', 'utils'],
  onCreated(template) {
    template.autorun(() => template.subscribe('departments', this.organizationId()));
  },
  _lText: 'Department/sector(s)',
  _rText() {
    return invoke(this.departments(), 'count');
  },
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onDeleteCb() {
    return this.onDelete.bind(this);
  },
  onChange(viewModel) {
    const { name } = viewModel.getData();
    const organizationId = this.organizationId();

    if (!viewModel._id) {
      Blaze.remove(viewModel.templateInstance.view);

      this.modal().callMethod(insert, { name, organizationId });
    } else {
      const _id = viewModel._id();

      this.modal().callMethod(update, { _id, name, organizationId });
    }
  },
  onDelete(viewModel) {
    if (!viewModel._id) {
      Blaze.remove(viewModel.templateInstance.view);
      return;
    }

    const { name } = viewModel.getData();

    swal({
      title: 'Are you sure?',
      text: `Department "${name}" will be removed.`,
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
            `Department "${name}" was removed successfully.`,
            'success'
          );
        }
      });
    });
  },
});
