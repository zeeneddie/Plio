import {
  StandardsBookSections
} from '/imports/api/standards-book-sections/standards-book-sections.js';
import {
  insert, update, remove
} from '/imports/api/standards-book-sections/methods.js';

Template.OrganizationSettings_StandardsBookSections.viewmodel({
  addStandardsBookSectionForm() {
    Blaze.renderWithData(
      Template.OrganizationSettings_StandardsBookSection,
      {
        onChange: this.onChangeCb(),
        onDelete: this.onDeleteCb()
      },
      this.templateInstance.$("#standards-book-sections-forms")[0]
    );
  },
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
    const { name, number } = viewModel.getData();

    if (!viewModel._id) {
      const organizationId = this.organizationId();

      insert.call({ name, number, organizationId }, (err, res) => {
        if (err) {
          console.log(err);
          toastr.error('Failed to create a standards book section');
        }

        Blaze.remove(viewModel.templateInstance.view);
      });
    } else {
      const _id = viewModel._id();

      update.call({ _id, name, number }, (err, res) => {
        if (err) {
          toastr.error('Failed to update a standards book section');
        }
      });
    }
  },
  onDelete(viewModel) {
    if (!viewModel._id) {
      Blaze.remove(viewModel.templateInstance.view);
      return;
    }

    if (!confirm('Delete this standards book section?')) return;

    const _id = viewModel._id();

    remove.call({ _id }, (err, res) => {
      if (err) {
        toastr.error('Failed to remove a standards book section');
      }
    });
  }
});
