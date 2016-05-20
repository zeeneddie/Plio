import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { insert, update, remove } from '/imports/api/standards-types/methods.js';


Template.OrganizationSettings_StandardTypes.viewmodel({
  mixin: ['collapse', 'addForm', 'modal'],
  standardsTypesCount() {
    return StandardTypes.find({
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

    if (!confirm('Delete this standards type?')) return;

    const _id = viewModel._id();
    const organizationId = this.organizationId();

    this.modal().callMethod(remove, { _id, organizationId });
  }
});
