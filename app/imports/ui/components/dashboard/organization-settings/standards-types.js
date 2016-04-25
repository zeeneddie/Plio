import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';
import { insert, update, remove } from '/imports/api/standards-types/methods.js';


Template.OrganizationSettings_StandardsTypes.viewmodel({
  addStandardsTypeForm() {
    Blaze.renderWithData(
      Template.OrganizationSettings_StandardsType,
      {
        onChange: this.onChangeCb(),
        onDelete: this.onDeleteCb()
      },
      this.templateInstance.$("#standard-types-forms")[0]
    );
  },
  standardsTypesCount() {
    return StandardsTypes.find({
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
    const { name, abbreviation } = viewModel.getData();

    if (!viewModel._id) {
      const organizationId = this.organizationId();

      insert.call({ name, abbreviation, organizationId }, (err, res) => {
        if (err) {
          toastr.error('Failed to create standards type');
        }

        Blaze.remove(viewModel.templateInstance.view);
      });
    } else {
      const _id = viewModel._id();

      update.call({ _id, name, abbreviation }, (err, res) => {
        if (err) {
          toastr.error('Failed to update standards type');
        }
      });
    }
  },
  onDelete(viewModel) {
    if (!viewModel._id) {
      Blaze.remove(viewModel.templateInstance.view);
      return;
    }

    if (!confirm('Delete this standards type?')) return;

    const _id = viewModel._id();

    remove.call({ _id }, (err, res) => {
      if (err) {
        toastr.error('Failed to remove standards type');
      }
    });
  }
});
