import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { swal } from 'meteor/plio:bootstrap-sweetalert';
import invoke from 'lodash.invoke';

import { insert, update, remove } from '/imports/api/departments/methods';
import { OrganizationSettingsHelp } from '/imports/api/help-messages';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

Template.OrgSettings_Departments.viewmodel({
  mixin: ['addForm', 'modal', 'utils'],
  _lText: 'Department/sector(s)',
  _rText() {
    return invoke(this.departments(), 'count');
  },
  placeholder: 'Department/sector',
  departments: '',
  helpText: OrganizationSettingsHelp.departments,
  departmentsMapped() {
    return this.departments() && this.departments().map(({ name, ...args }) => ({
      ...args,
      title: name,
    }));
  },
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onDeleteCb() {
    return this.onDelete.bind(this);
  },
  onChange(viewModel) {
    const { title: name } = viewModel.getData();
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

    const { title } = viewModel.getData();

    swal({
      title: 'Are you sure?',
      text: `Department "${title}" will be removed.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      closeOnConfirm: false,
    }, () => {
      const _id = viewModel._id();
      const organizationId = this.organizationId();

      this.modal().callMethod(remove, { _id, organizationId }, (err) => {
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
            text: `Department "${title}" was removed successfully.`,
            type: 'success',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
          });
        }
      });
    });
  },
});
