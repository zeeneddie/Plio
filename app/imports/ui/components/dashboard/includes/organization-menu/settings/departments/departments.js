import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { Departments } from '/imports/share/collections/departments.js';
import { OrgSettingsDocSubs } from '/imports/startup/client/subsmanagers.js';
import { insert, update, remove } from '/imports/api/departments/methods.js';
import { OrganizationSettingsHelp } from '/imports/api/help-messages.js';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

Template.OrgSettings_Departments.viewmodel({
  mixin: ['addForm', 'modal', 'utils'],
  onCreated(template) {
    template.autorun(() => OrgSettingsDocSubs.subscribe('departments', this.organizationId()));
  },
  _lText: 'Department/sector(s)',
  _rText() {
    return invoke(this.departments(), 'count');
  },
  placeholder: 'Department/sector',
  departments: '',
  helpText: OrganizationSettingsHelp.departments,
  departmentsMapped() {
    return this.departments() && this.departments().map(({ name, ...args }) => ({ ...args, title: name }));
  },
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onDeleteCb() {
    return this.onDelete.bind(this);
  },
  onChange(viewModel) {
    const { title:name } = viewModel.getData();
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
      closeOnConfirm: false
    }, () => {
      const _id = viewModel._id();
      const organizationId = this.organizationId();

      this.modal().callMethod(remove, { _id, organizationId }, (err) => {
        if (err) {
          swal('Oops... Something went wrong!', err.reason, 'error');
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
