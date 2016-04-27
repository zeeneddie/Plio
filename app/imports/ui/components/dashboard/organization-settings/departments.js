import { Departments } from '/imports/api/departments/departments.js';
import { insert, update, remove } from '/imports/api/departments/methods.js';


Template.OrganizationSettings_Departments.viewmodel({
  mixin: ['collapse', 'addForm', 'editableModalSection'],
  departmentsCount() {
    return Departments.find({
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
    const { name } = viewModel.getData();

    if (!viewModel._id) {
      const organizationId = this.organizationId();

      Blaze.remove(viewModel.templateInstance.view);

      this.callMethod(insert, { name, organizationId });
    } else {
      const _id = viewModel._id();

      this.callMethod(update, { _id, name });
    }
  },
  onDelete(viewModel) {
    if (!viewModel._id) {
      Blaze.remove(viewModel.templateInstance.view);
      return;
    }

    if (!confirm('Delete this department?')) {
      return;
    }

    const _id = viewModel._id();

    this.callMethod(remove, { _id });
  },
});
