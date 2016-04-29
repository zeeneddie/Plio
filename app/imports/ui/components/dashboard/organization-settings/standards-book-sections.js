import {
  StandardsBookSections
} from '/imports/api/standards-book-sections/standards-book-sections.js';
import {
  insert, update, remove
} from '/imports/api/standards-book-sections/methods.js';

Template.OrganizationSettings_StandardsBookSections.viewmodel({
  mixin: ['collapse', 'addForm', 'editableModalSection'],
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

    if (!viewModel._id) {
      const organizationId = this.organizationId();

      Blaze.remove(viewModel.templateInstance.view);

      this.callMethod(insert, {
        title, organizationId
      });
    } else {
      const _id = viewModel._id();

      this.callMethod(update, { _id, title });
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

    this.callMethod(remove, { _id });
  }
});
