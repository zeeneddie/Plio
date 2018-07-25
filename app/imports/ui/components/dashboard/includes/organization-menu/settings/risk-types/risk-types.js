import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { swal } from 'meteor/plio:bootstrap-sweetalert';
import invoke from 'lodash.invoke';

import { insert, update, remove } from '/imports/api/risk-types/methods';
import { OrganizationSettingsHelp } from '/imports/api/help-messages';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

Template.OrgSettings_RisksTypes.viewmodel({
  mixin: ['modal', 'addForm', 'utils'],
  _lText: 'Risk types',
  _rText() {
    return invoke(this.riskTypes(), 'count');
  },
  placeholder: 'Title',
  helpText: OrganizationSettingsHelp.riskTypes,
  riskTypes: [],
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
        title, organizationId,
      });
    } else {
      const _id = viewModel._id();

      this.modal().callMethod(update, { _id, title });
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
      text: `Risk type "${title}" will be removed.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      closeOnConfirm: false,
    }, () => {
      const _id = viewModel._id();

      this.modal().callMethod(remove, { _id }, (err) => {
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
            text: `Risk type "${title}" was removed successfully.`,
            type: 'success',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
          });
        }
      });
    });
  },
});
