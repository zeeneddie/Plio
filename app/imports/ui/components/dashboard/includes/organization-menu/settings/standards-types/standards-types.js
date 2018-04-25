import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { swal } from 'meteor/plio:bootstrap-sweetalert';
import { map, T, identity, assoc, cond } from 'ramda';

import { insert, update, remove } from '../../../../../../../api/standards-types/methods';
import {
  isStandardOperatingProcedure,
  isSectionHeader,
} from '../../../../../../../api/standards-types/helpers';
import { OrganizationSettingsHelp } from '../../../../../../../api/help-messages';
import { ALERT_AUTOHIDE_TIME } from '../../../../../../../api/constants';

const mapStandardTypes = map(cond([
  // Disable inputs for standard operating procedure
  [isStandardOperatingProcedure, assoc('disabled', true)],
  // Hide abbreviation input for section header
  [isSectionHeader, assoc('showAbbreviation', false)],
  // don't do anything
  [T, identity],
]));

Template.OrgSettings_StandardTypes.viewmodel({
  mixin: ['addForm', 'modal', 'utils'],
  _lText: 'Standards types',
  _rText() {
    return this.standardsTypes().count();
  },
  helpText: OrganizationSettingsHelp.standardTypes,
  placeholder: 'Standard type',
  items: mapStandardTypes,
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onDeleteCb() {
    return this.onDelete.bind(this);
  },
  onChange(viewModel) {
    const { title, abbreviation } = viewModel.getData();
    const organizationId = this.organizationId();

    if (!viewModel._id) {
      Blaze.remove(viewModel.templateInstance.view);

      this.modal().callMethod(insert, {
        title, abbreviation, organizationId,
      });
    } else {
      const _id = viewModel._id();

      this.modal().callMethod(update, {
        _id, title, abbreviation, organizationId,
      });
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
      text: `Standard type "${title}" will be removed.`,
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
            text: `Standard type "${title}" was removed successfully.`,
            type: 'success',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
          });
        }
      });
    });
  },
});
