import { Template } from 'meteor/templating';
import { OrgSettingsDocSubs } from '/imports/startup/client/subsmanagers.js';
import invoke from 'lodash.invoke';

import {
  StandardsBookSections
} from '/imports/share/collections/standards-book-sections.js';
import {
  insert, update, remove
} from '/imports/api/standards-book-sections/methods.js';


Template.OrgSettings_StandardsBookSections.viewmodel({
  mixin: ['addForm', 'modal', 'utils'],
  onCreated(template) {
    template.autorun(() => OrgSettingsDocSubs.subscribe('standards-book-sections', this.organizationId()));
  },
  _lText: 'Compliance standards sections',
  _rText() {
    return invoke(this.standardsBookSections(), 'count');
  },
  placeholder: 'Title',
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
      text: `Standards section "${title}" will be removed.`,
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
            `Standards section "${title}" was removed successfully.`,
            'success'
          );
        }
      });
    });
  }
});
