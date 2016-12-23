import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { StandardTypes } from '/imports/share/collections/standards-types.js';
import { insert, update, remove } from '/imports/api/standard-types/methods.js';
import { OrganizationSettingsHelp } from '/imports/api/help-messages.js';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

Template.OrgSettings_StandardTypes.viewmodel({
  mixin: ['addForm', 'modal', 'utils'],
  onCreated(template) {
    template.autorun(() => template.subscribe('standard-types', this.organizationId()));
  },
  _lText: 'Standards types',
  _rText() {
    return invoke(this.standardsTypes(), 'count');
  },
  helpText: OrganizationSettingsHelp.standardTypes,
  placeholder: 'Standard type',
  standardsTypesMapped() {
    return this.standardsTypes() && this.standardsTypes().map(({ name, ...args }) => ({ ...args, title: name }));
  },
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onDeleteCb() {
    return this.onDelete.bind(this);
  },
  onChange(viewModel) {
    const { title:name, abbreviation } = viewModel.getData();
    const organizationId = this.organizationId();

    if (!viewModel._id) {
      Blaze.remove(viewModel.templateInstance.view);

      this.modal().callMethod(insert, {
        name, abbreviation, organizationId
      });
    } else {
      const _id = viewModel._id();

      this.modal().callMethod(update, { _id, name, abbreviation, organizationId });
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
      closeOnConfirm: false
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
  }
});
