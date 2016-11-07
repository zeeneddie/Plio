import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { OrgSettingsDocSubs } from '/imports/startup/client/subsmanagers.js';
import { insert, update, remove } from '/imports/api/risk-types/methods.js';
import { OrganizationSettingsHelp } from '/imports/api/help-messages.js';

Template.OrgSettings_RisksTypes.viewmodel({
  mixin: ['modal', 'addForm', 'utils'],
  onCreated(template) {
    template.autorun(() => OrgSettingsDocSubs.subscribe('riskTypes', this.organizationId()));
  },
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
        title, organizationId
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
      closeOnConfirm: false
    }, () => {
      const _id = viewModel._id();

      this.modal().callMethod(remove, { _id }, (err) => {
        if (err) {
          swal('Oops... Something went wrong!', err.reason, 'error');
        } else {
          swal(
            'Removed!',
            `Risk type "${title}" was removed successfully.`,
            'success'
          );
        }
      });
    });
  }
});
