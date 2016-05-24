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

    if (!confirm('Delete this standards book section?')) {
      return;
    }

    const _id = viewModel._id();
    const organizationId = this.organizationId();

    this.modal().callMethod(remove, { _id, organizationId });
  }
});
