import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { insert, update, remove } from '/imports/api/standards-types/methods.js';

Template.OrgSettings_StandardTypes.viewmodel({
  mixin: ['addForm', 'modal', 'utils'],
  onCreated(template) {
    template.autorun(() => template.subscribe('standards-types', this.organizationId()));
  },
  _lText: 'Standards types',
  _rText() {
    return invoke(this.standardsTypes(), 'count');
  },
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
          swal('Oops... Something went wrong!', err.reason, 'error');
        } else {
          swal(
            'Removed!',
            `Standard type "${title}" was removed successfully.`,
            'success'
          );
        }
      });
    });
  }
});
