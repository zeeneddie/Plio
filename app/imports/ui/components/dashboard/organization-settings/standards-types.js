import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';
import { insert, update, remove } from '/imports/api/standards-types/methods.js';


Template.OrganizationSettings_StandardsTypes.viewmodel({
  mixin: ['collapse', 'addForm', 'editableModalSection'],
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

      Blaze.remove(viewModel.templateInstance.view);

      this.callMethod(insert, {
        name, abbreviation, organizationId
      });
    } else {
      const _id = viewModel._id();

      this.callMethod(update, { _id, name, abbreviation });
    }
  },
  onDelete(viewModel) {
    if (!viewModel._id) {
      Blaze.remove(viewModel.templateInstance.view);
      return;
    }

    if (!confirm('Delete this standards type?')) return;

    const _id = viewModel._id();

    this.callMethod(remove, { _id });
  }
});
